import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import dayjs from 'dayjs';

import {
  TokenLimitConfig,
  TokenLimitConfigDocument,
} from './token-limit-config.schema';
import {
  CreateTokenLimitConfigDto,
  UpdateTokenLimitConfigDto,
} from './dto/token-limit-config.dto';
import { User, UserDocument } from '../auth/user.schema';

@Injectable()
export class TokenLimitService {
  constructor(
    @InjectModel(TokenLimitConfig.name)
    private readonly configModel: Model<TokenLimitConfigDocument>,

    @InjectModel(User.name)
    public readonly userModel: Model<UserDocument>,
  ) {}

  // ---------------------------------------------------------------------------
  // TokenLimitConfig CRUD
  // ---------------------------------------------------------------------------

  async create(dto: CreateTokenLimitConfigDto): Promise<TokenLimitConfig> {
    const doc = new this.configModel(dto);
    return doc.save();
  }

  async findAll(): Promise<TokenLimitConfig[]> {
    return this.configModel.find().exec();
  }

  async findBySubscription(subscription: string): Promise<TokenLimitConfig> {
    const doc = await this.configModel.findOne({ subscription }).exec();
    if (!doc) {
      throw new NotFoundException(
        `No TokenLimitConfig found for subscription "${subscription}"`,
      );
    }
    return doc;
  }

  async findById(id: string): Promise<TokenLimitConfig> {
    const doc = await this.configModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`TokenLimitConfig "${id}" not found`);
    }
    return doc;
  }

  async update(
    id: string,
    dto: UpdateTokenLimitConfigDto,
  ): Promise<TokenLimitConfig> {
    const doc = await this.configModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!doc) {
      throw new NotFoundException(`TokenLimitConfig "${id}" not found`);
    }
    return doc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.configModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`TokenLimitConfig "${id}" not found`);
    }
  }

  // ---------------------------------------------------------------------------
  // Reusable token-limit helpers operating on a User document
  // ---------------------------------------------------------------------------

  /**
   * Add `delta` tokens to `user.usedTokens` and persist.
   * Returns the updated user document.
   */
  async updateUsedTokens(
    userId: Types.ObjectId,
    delta: number,
  ): Promise<UserDocument> {
    const user = await this._requireUser(userId);
    user.usedTokens = (user.usedTokens ?? 0) + delta;
    await user.save();
    return user;
  }

  /**
   * Reset `user.usedTokens` to 0 and push `tokenCountResetDate` forward by
   * the number of minutes defined in the TokenLimitConfig for the user's
   * subscription (falls back to `process.env.MINUTES_TILL_TOKEN_LIMIT_RESET`
   * and then to 1 minute if neither is available).
   *
   * Returns the updated user document.
   */
  async resetTokenLimit(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this._requireUser(userId);
    const minutes = await this._resolveMinutesTillReset(user.subscription);
    user.tokenCountResetDate = dayjs().add(minutes, 'minute').toDate();
    user.usedTokens = 0;
    await user.save();
    return user;
  }

  /**
   * Overwrite `user.usedTokens` with an explicit value and persist.
   * Returns the updated user document.
   */
  async setUsedTokens(
    userId: Types.ObjectId,
    tokens: number,
  ): Promise<UserDocument> {
    const user = await this._requireUser(userId);
    user.usedTokens = tokens;
    await user.save();
    return user;
  }

  /**
   * Convenience: return the `tokensPerIntervall` limit for a given user.
   * Falls back to `process.env.MAX_TOKENS_PER_MINUTE` if no DB config exists.
   */
  async getTokensPerIntervall(subscription: string): Promise<number> {
    try {
      const cfg = await this.findBySubscription(subscription);
      return cfg.tokensPerInterval;
    } catch {
      return parseInt(process.env.MAX_TOKENS_PER_MINUTE ?? '0', 10);
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async _requireUser(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new ForbiddenException('Token limit verification failed!!');
    }
    return user;
  }

  private async _resolveMinutesTillReset(subscription: string): Promise<number> {
    try {
      const cfg = await this.findBySubscription(subscription);
      return cfg.minutesTillReset;
    } catch {
      const envMinutes = parseInt(
        process.env.MINUTES_TILL_TOKEN_LIMIT_RESET ?? '1',
        10,
      );
      return Number.isFinite(envMinutes) ? envMinutes : 1;
    }
  }
}
