import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument, ChatEntryDto } from './chat.schema';
import { ChatMetadataService } from '../chat-metadata/chat-metadata.service';
import { User, UserDocument } from '../auth/user.schema';
@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly chatMetadataService: ChatMetadataService,
  ) {}

  /**
   * Persist a Chat Completions exchange as a rolling message array.
   * The latest doc for internalChatId holds the full history.
   */
  async saveCompletionEntry(
    userId: Types.ObjectId,
    internalChatId: string,
    messages: Record<string, unknown>[],
    name?: string,
    chatInternalId?: string,
  ): Promise<ChatDocument> {
    const doc = new this.chatModel({
      userId,
      internalChatId: chatInternalId,
      name: name ?? null,
      messages,
      chatInternalId: chatInternalId ?? null,
    });
    const saved = await doc.save();
    this.logger.log(
      `Saved completion chat entry — user=${userId} chatId=${internalChatId}`,
    );
    return saved;
  }

  /**
   * Fetch the most recent message-array history for a Chat Completions
   * session. Returns an empty array when the session has no entries yet.
   */
  async getMessageHistory(
    userId: Types.ObjectId,
    internalChatId: string,
  ): Promise<Record<string, unknown>[]> {
    const latest = await this.chatModel
      .findOne({ internalChatId, messages: { $ne: null } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!latest) return [];

    // Throws ForbiddenException unless the caller is the owner or a shared user.
    await this.chatMetadataService.findOne(userId, internalChatId);

    return (latest.messages as Record<string, unknown>[]) ?? [];
  }

  /**
   * Return all entries for a session, oldest-first.
   * Throws ForbiddenException if the session belongs to a different user.
   */
  async findByInternalChatId(
    userId: Types.ObjectId,
    internalChatId: string,
  ): Promise<ChatEntryDto[]> {
    const entries = await this.chatModel
      .find({ internalChatId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    if (entries.length === 0) return [];

    // Throws ForbiddenException/NotFoundException unless the caller is the
    // owner or a shared user — the query above already returns entries
    // written by *any* user who has access to this session.
    await this.chatMetadataService.findOne(userId, internalChatId);

    const distinctUserIds = [
      ...new Set(entries.map((e) => e.userId.toString())),
    ];
    const users = await this.userModel
      .find({ _id: { $in: distinctUserIds } })
      .select('username')
      .lean()
      .exec();
    const usernameById = new Map(
      users.map((u) => [u._id.toString(), u.username]),
    );

    return entries.map((e) => {
      const username = usernameById.get(e.userId.toString());
      return { ...e, username } as unknown as ChatEntryDto;
    });
  }

  /** Return all unique chat sessions belonging to this user, newest-first. */
  async listChats(
    userId: Types.ObjectId,
  ): Promise<
    { internalChatId: string; name: string | null; lastActivity: Date }[]
  > {
    return this.chatModel
      .aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$internalChatId',
            name: { $first: '$name' },
            lastActivity: { $first: '$createdAt' },
          },
        },
        {
          $project: {
            _id: 0,
            internalChatId: '$_id',
            name: 1,
            lastActivity: 1,
          },
        },
        { $sort: { lastActivity: -1 } },
      ])
      .exec();
  }
}
