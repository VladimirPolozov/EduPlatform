import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CourseController } from './presentation/controllers/course.controller';
import { CreateCourseUseCase } from './application/use-cases/create-course.use-case';
import { GetCourseUseCase } from './application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from './application/use-cases/update-course.use-case';
import { DeleteCourseUseCase } from './application/use-cases/delete-course.use-case';
import { EnrollCourseUseCase } from './application/use-cases/enroll-course.use-case';
import { ICourseRepository } from './domain/repositories/course.repository.interface';
import { CourseDocumentClass, CourseSchema } from './infrastructure/database/course.schema';
import { MongooseCourseRepository } from './infrastructure/database/mongoose-course.repository';
import { RedisCacheService } from './infrastructure/cache/redis-cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseDocumentClass.name, schema: CourseSchema },
    ]),
    AuthModule,
    ConfigModule,
    UsersModule,
  ],
  controllers: [CourseController],
  providers: [
    {
      provide: ICourseRepository,
      useClass: MongooseCourseRepository,
    },
    RedisCacheService,
    CreateCourseUseCase,
    GetCourseUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    EnrollCourseUseCase,
  ],
  exports: [ICourseRepository, MongooseModule],
})
export class CoursesModule {}
