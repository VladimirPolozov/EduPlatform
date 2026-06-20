import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Lesson } from '../../domain/entities/lesson.entity';
import { ICourseRepository } from '../../../courses/domain/repositories/course.repository.interface';

@Injectable()
export class CreateLessonUseCase {
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(data: { title: string; content: string; courseId: string; teacherId: string; order?: number }): Promise<Lesson> {
    const course = await this.courseRepository.findById(data.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (course.teacherId !== data.teacherId) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }

    const lesson = new Lesson({
      title: data.title,
      content: data.content,
      courseId: data.courseId,
      order: data.order ?? 0,
    });

    return this.lessonRepository.create(lesson);
  }
}
