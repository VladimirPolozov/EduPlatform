import { Course } from '../entities/course.entity';

export interface ICourseRepository {
  create(course: Course): Promise<Course>;
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  update(id: string, course: Partial<Course>): Promise<Course | null>;
  delete(id: string): Promise<void>;
}

export const ICourseRepository = Symbol('ICourseRepository');
