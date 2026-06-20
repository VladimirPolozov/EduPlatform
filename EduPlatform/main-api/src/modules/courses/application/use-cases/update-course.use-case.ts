import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { Course } from '../../domain/entities/course.entity';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(id: string, teacherId: string, data: { title?: string; description?: string; price?: number }): Promise<Course> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Course not found');
    }
    if (existing.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const updated = await this.courseRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException('Course not found');
    }

    await this.cache.del('courses:list');
    await this.cache.del(`courses:${id}`);

    return updated;
  }
}
