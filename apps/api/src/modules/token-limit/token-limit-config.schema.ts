import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenLimitConfigDocument = TokenLimitConfig & Document;

@Schema({ collection: 'token_limit_configs', timestamps: true })
export class TokenLimitConfig {
  /** How many minutes until the token counter resets */
  @Prop({ required: true })
  minutesTillReset: number;

  /** How many tokens are allowed within one interval */
  @Prop({ required: true })
  tokensPerInterval: number;

  /**
   * Which subscription tier this config applies to — a free-form string
   * (not restricted to SubscriptionType). Creating a config with a new
   * tier name effectively defines a new subscription type.
   */
  @Prop({ required: true, type: String, unique: true })
  subscription: string;
}

export const TokenLimitConfigSchema =
  SchemaFactory.createForClass(TokenLimitConfig);
