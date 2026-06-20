import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson } from '../../domain/entities/lesson.entity';
import { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { LessonDocument, LessonDocumentClass } from './lesson.schema';

@Injectable()
export class MongooseLessonRepository implements ILessonRepository {
  constructor(
    @InjectModel(LessonDocumentClass.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {}

  private mapToDomain(doc: LessonDocument): Lesson {
    return new Lesson({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      courseId: doc.courseId.toString(),
      order: doc.order,
    });
  }

  async create(lesson: Lesson): Promise<Lesson> {
    const created = new this.lessonModel({
      title: lesson.title,
      content: lesson.content,
      courseId: lesson.courseId,
      order: lesson.order ?? 0,
    });
    const saved = await created.save();
    return this.mapToDomain(saved);
  }

  async findByCourseId(courseId: string): Promise<Lesson[]> {
    const docs = await this.lessonModel.find({ courseId } as any).sort({ order: 1 }).exec();
    return docs.map((doc) => this.mapToDomain(doc));
  }

  async findById(id: string): Promise<Lesson | null> {
    const doc = await this.lessonModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.order !== undefined) updateData.order = data.order;

    const doc = await this.lessonModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await this.lessonModel.findByIdAndDelete(id).exec();
  }
}
