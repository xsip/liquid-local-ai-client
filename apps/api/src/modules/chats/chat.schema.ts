import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type ChatDocument = Chat & Document;

@Schema({ collection: 'chats', timestamps: true })
export class Chat {
  /** Owner — ObjectId of the authenticated user who triggered this exchange */
  @Prop({ required: true, type: Types.ObjectId, index: true, ref: 'User' })
  userId: Types.ObjectId;

  /** MD5 hash that groups all messages belonging to one chat session */
  @Prop({ required: true, index: true })
  internalChatId: string;

  /**
   * ObjectId (hex string) of the ChatMetadata document that owns this message.
   * Set automatically when a new chat is created.
   * Null for legacy entries created before ChatMetadata was introduced.
   */
  @Prop({ required: false, default: null, type: String, index: true })
  chatInternalId: string | null;

  /** Optional human-readable label for the chat */
  @Prop({ required: false, default: null, type: String })
  name: string | null;

  /**
   * Rolling Chat Completions message array (system/user/assistant/tool turns).
   * One document per chat session holds the full history — see
   * ChatsService.saveCompletionEntry, which upserts this array turn-by-turn
   * instead of inserting a new row per turn.
   */
  @Prop({ required: false, default: null, type: [Object] })
  messages: Record<string, unknown>[] | null;

  /**
   * Parallel array to `messages` — `messageSenders[i]` is the username of
   * whoever submitted the turn that produced `messages[i]` (used to label
   * "You" vs. another user's name in shared chats). `null` for entries
   * written before this field existed.
   */
  @Prop({ required: false, default: null, type: [String] })
  messageSenders: (string | null)[] | null;

  // `createdAt` / `updatedAt` are injected automatically by { timestamps: true }
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

// Compound index: ownership + session lookup in one shot
ChatSchema.index({ userId: 1, internalChatId: 1 });

// ── Swagger-friendly DTO mirror ──────────────────────────────────────────────

export class ChatEntryDto {
  @ApiProperty({ description: 'ObjectId of the owning user' })
  userId: string;

  @ApiProperty()
  internalChatId: string;

  @ApiPropertyOptional({
    nullable: true,
    description: 'ChatMetadata ObjectId reference',
  })
  chatInternalId: string | null;

  @ApiPropertyOptional({ nullable: true })
  name: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Username of the user who wrote this entry (shared chats)',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'Rolling Chat Completions message array, when applicable',
  })
  messages?: Record<string, unknown>[] | null;

  @ApiPropertyOptional({
    description:
      'Parallel array to `messages` — username of whoever submitted each turn, for labeling shared chats. Null for entries written before this field existed.',
    type: [String],
    nullable: true,
  })
  messageSenders?: (string | null)[] | null;
}
