import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../auth/roles.decorator';

export type AssetBlobDocument = AssetBlob & Document;

export enum AssetRole {
  AI = 'AI',
  USER = 'USER',
}

@Schema({ collection: 'assets', timestamps: true })
export class AssetBlob {
  @Prop({ required: true, lowercase: true, trim: true })
  userId: string;

  @Prop({ required: true, lowercase: true, trim: true })
  chatId: string;

  /** Original file name (sanitised) */
  @Prop({ required: true })
  filename: string;

  /** Original file name (sanitised) */
  @Prop({ required: true })
  displayName: string;

  /** MIME type, e.g. image/jpeg */
  @Prop({ required: true })
  mimeType: string;

  /** Raw binary data stored as a Buffer in MongoDB */
  @Prop({ required: true, type: Buffer })
  data: Buffer;
  /** Raw binary data stored as a Buffer in MongoDB */
  @Prop({ required: false, type: Buffer })
  thumbnailData: Buffer;

  @Prop({
    required: true,
    enum: Object.values(AssetRole),
  })
  role: AssetRole;

  @Prop({ required: true, type: Boolean })
  isVisible?: boolean;
}

export const AssetBlobSchema = SchemaFactory.createForClass(AssetBlob);

// Index for fast lookups by tenant + filename
AssetBlobSchema.index({ tenant: 1, filename: 1 }, { unique: true });
