import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = UserDocumentClass & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserDocumentClass {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, enum: ['student', 'teacher'] })
  role!: 'student' | 'teacher';

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }], default: [] })
  enrolledCourses!: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocumentClass);
