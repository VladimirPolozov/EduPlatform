import mongoose, { Schema, model, Model, Document } from 'mongoose';
import { config } from '../config';

interface IImage extends Document {
  filename: string;
  filepath: string;
  courseId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  status: string;
  processedPath?: string;
}

const imageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, enum: ['processing', 'ready', 'failed'], default: 'processing' },
  processedPath: { type: String },
}, { timestamps: true, collection: 'images' });

const ImageModel: Model<IImage> = model<IImage>('Image', imageSchema);

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(config.mongodbUri);
  console.log('MongoDB connected');
}

export async function updateImageStatus(
  id: string,
  status: string,
  processedPath?: string,
): Promise<void> {
  const update: Record<string, unknown> = { status };
  if (processedPath !== undefined) update.processedPath = processedPath;
  await ImageModel.findByIdAndUpdate(id, update).exec();
}
