import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Lesson } from '../../domain/entities/lesson.entity';
import { ICourseRepository } from '../../../courses/domain/repositories/course.repository.interface';

@Injectable()
export class UpdateLessonUseCase {
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string, teacherId: string, data: { title?: string; content?: string; order?: number }): Promise<Lesson> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const course = await this.courseRepository.findById(lesson.courseId);
    if (!course || course.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update lessons in your own courses');
    }

    const updated = await this.lessonRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException('Lesson not found');
    }
    return updated;
  }
}
