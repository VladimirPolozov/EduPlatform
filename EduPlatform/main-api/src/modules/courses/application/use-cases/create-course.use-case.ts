import { Inject, Injectable } from '@nestjs/common';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { Course } from '../../domain/entities/course.entity';
import { RedisCacheService } from '../../infrastructure/cache/redis-cache.service';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(data: { title: string; description: string; teacherId: string; price?: number }): Promise<Course> {
    const course = new Course({
      title: data.title,
      description: data.description,
      teacherId: data.teacherId,
      price: data.price ?? 0,
    });
    const created = await this.courseRepository.create(course);

    await this.cache.del('courses:list');

    return created;
  }
}
