import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CourseDocument = CourseDocumentClass & Document;

@Schema({ timestamps: true, collection: 'courses' })
export class CourseDocumentClass {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  teacherId!: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  price!: number;
}

export const CourseSchema = SchemaFactory.createForClass(CourseDocumentClass);
