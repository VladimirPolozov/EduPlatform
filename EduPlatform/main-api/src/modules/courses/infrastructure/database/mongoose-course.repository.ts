import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseDocument, CourseDocumentClass } from './course.schema';

@Injectable()
export class MongooseCourseRepository implements ICourseRepository {
  constructor(
    @InjectModel(CourseDocumentClass.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  private mapToDomain(doc: CourseDocument): Course {
    return new Course({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      teacherId: doc.teacherId.toString(),
      price: doc.price,
    });
  }

  async create(course: Course): Promise<Course> {
    const created = new this.courseModel({
      title: course.title,
      description: course.description,
      teacherId: course.teacherId,
      price: course.price ?? 0,
    });
    const saved = await created.save();
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Course | null> {
    const doc = await this.courseModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async findAll(): Promise<Course[]> {
    const docs = await this.courseModel.find().exec();
    return docs.map((doc) => this.mapToDomain(doc));
  }

  async update(id: string, data: Partial<Course>): Promise<Course | null> {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;

    const doc = await this.courseModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await this.courseModel.findByIdAndDelete(id).exec();
  }
}
