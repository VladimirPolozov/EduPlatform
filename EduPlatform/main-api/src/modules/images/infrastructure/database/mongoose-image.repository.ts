import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from '../../domain/entities/image.entity';
import { IImageRepository } from '../../domain/repositories/image.repository.interface';
import { ImageDocument, ImageDocumentClass } from './image.schema';

@Injectable()
export class MongooseImageRepository implements IImageRepository {
  constructor(
    @InjectModel(ImageDocumentClass.name)
    private readonly imageModel: Model<ImageDocument>,
  ) {}

  private mapToDomain(doc: ImageDocument): Image {
    return new Image({
      id: doc._id.toString(),
      filename: doc.filename,
      filepath: doc.filepath,
      courseId: doc.courseId.toString(),
      uploadedBy: doc.uploadedBy.toString(),
      status: doc.status as Image['status'],
      processedPath: doc.processedPath,
    });
  }

  async create(image: Image): Promise<Image> {
    const created = new this.imageModel({
      filename: image.filename,
      filepath: image.filepath,
      courseId: image.courseId,
      uploadedBy: image.uploadedBy,
      status: image.status ?? 'processing',
    });
    const saved = await created.save();
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Image | null> {
    const doc = await this.imageModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async updateStatus(id: string, status: string, processedPath?: string): Promise<void> {
    const update: Record<string, unknown> = { status };
    if (processedPath !== undefined) update.processedPath = processedPath;
    await this.imageModel.findByIdAndUpdate(id, update).exec();
  }
}
