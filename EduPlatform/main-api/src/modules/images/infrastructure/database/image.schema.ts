import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ImageDocument = ImageDocumentClass & Document;

@Schema({ timestamps: true, collection: 'images' })
export class ImageDocumentClass {
  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  filepath!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId!: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  uploadedBy!: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['processing', 'ready', 'failed'], default: 'processing' })
  status!: string;

  @Prop()
  processedPath?: string;
}

export const ImageSchema = SchemaFactory.createForClass(ImageDocumentClass);
