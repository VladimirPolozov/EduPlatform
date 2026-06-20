import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { ICourseRepository } from '../../../courses/domain/repositories/course.repository.interface';

@Injectable()
export class DeleteLessonUseCase {
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string, teacherId: string): Promise<void> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const course = await this.courseRepository.findById(lesson.courseId);
    if (!course || course.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete lessons in your own courses');
    }

    await this.lessonRepository.delete(id);
  }
}
