import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    ImagesModule,
  ],
})
export class AppModule {}
