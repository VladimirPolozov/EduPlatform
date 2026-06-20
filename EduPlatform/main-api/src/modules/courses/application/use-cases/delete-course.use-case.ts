import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(id: string, teacherId: string): Promise<void> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Course not found');
    }
    if (existing.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepository.delete(id);

    await this.cache.del('courses:list');
    await this.cache.del(`courses:${id}`);
  }
}
