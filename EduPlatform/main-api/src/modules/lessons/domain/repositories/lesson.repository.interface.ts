import { Lesson } from '../entities/lesson.entity';

export interface ILessonRepository {
  create(lesson: Lesson): Promise<Lesson>;
  findByCourseId(courseId: string): Promise<Lesson[]>;
  findById(id: string): Promise<Lesson | null>;
  update(id: string, lesson: Partial<Lesson>): Promise<Lesson | null>;
  delete(id: string): Promise<void>;
}

export const ILessonRepository = Symbol('ILessonRepository');
