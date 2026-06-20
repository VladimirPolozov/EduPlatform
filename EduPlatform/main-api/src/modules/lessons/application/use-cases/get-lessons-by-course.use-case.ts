import { Inject, Injectable } from '@nestjs/common';
import { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { Lesson } from '../../domain/entities/lesson.entity';

@Injectable()
export class GetLessonsByCourseUseCase {
  constructor(
    @Inject(ILessonRepository)
    private readonly lessonRepository: ILessonRepository,
  ) {}

  async execute(courseId: string): Promise<Lesson[]> {
    return this.lessonRepository.findByCourseId(courseId);
  }
}
