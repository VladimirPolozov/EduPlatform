import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LessonDocument = LessonDocumentClass & Document;

@Schema({ timestamps: true, collection: 'lessons' })
export class LessonDocumentClass {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true, index: true })
  courseId!: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  order!: number;
}

export const LessonSchema = SchemaFactory.createForClass(LessonDocumentClass);
