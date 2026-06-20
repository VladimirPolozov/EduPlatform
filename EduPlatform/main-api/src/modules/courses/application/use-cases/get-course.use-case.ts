import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { Course } from '../../domain/entities/course.entity';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Injectable()
export class GetCourseUseCase {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async findById(id: string): Promise<Course> {
    const cacheKey = `courses:${id}`;
    const cached = await this.cache.get<Course>(cacheKey);
    if (cached) return cached;

    const course = await this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.cache.set(cacheKey, course);
    return course;
  }

  async findAll(): Promise<Course[]> {
    const cacheKey = 'courses:list';
    const cached = await this.cache.get<Course[]>(cacheKey);
    if (cached) return cached;

    const courses = await this.courseRepository.findAll();

    await this.cache.set(cacheKey, courses);
    return courses;
  }
}
