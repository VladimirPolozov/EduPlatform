import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CoursesModule } from '../courses/courses.module';
import { LessonController } from './presentation/controllers/lesson.controller';
import { CreateLessonUseCase } from './application/use-cases/create-lesson.use-case';
import { GetLessonsByCourseUseCase } from './application/use-cases/get-lessons-by-course.use-case';
import { UpdateLessonUseCase } from './application/use-cases/update-lesson.use-case';
import { DeleteLessonUseCase } from './application/use-cases/delete-lesson.use-case';
import { ILessonRepository } from './domain/repositories/lesson.repository.interface';
import { LessonDocumentClass, LessonSchema } from './infrastructure/database/lesson.schema';
import { MongooseLessonRepository } from './infrastructure/database/mongoose-lesson.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LessonDocumentClass.name, schema: LessonSchema },
    ]),
    AuthModule,
    CoursesModule,
  ],
  controllers: [LessonController],
  providers: [
    {
      provide: ILessonRepository,
      useClass: MongooseLessonRepository,
    },
    CreateLessonUseCase,
    GetLessonsByCourseUseCase,
    UpdateLessonUseCase,
    DeleteLessonUseCase,
  ],
})
export class LessonsModule {}
