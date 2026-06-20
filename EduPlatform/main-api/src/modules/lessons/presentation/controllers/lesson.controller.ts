import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { CreateLessonUseCase } from '../../application/use-cases/create-lesson.use-case';
import { GetLessonsByCourseUseCase } from '../../application/use-cases/get-lessons-by-course.use-case';
import { UpdateLessonUseCase } from '../../application/use-cases/update-lesson.use-case';
import { DeleteLessonUseCase } from '../../application/use-cases/delete-lesson.use-case';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@Controller()
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly getLessonsByCourseUseCase: GetLessonsByCourseUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
    private readonly deleteLessonUseCase: DeleteLessonUseCase,
  ) {}

  @Get('courses/:courseId/lessons')
  async findByCourse(@Param('courseId') courseId: string) {
    return this.getLessonsByCourseUseCase.execute(courseId);
  }

  @Post('courses/:courseId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async create(@Param('courseId') courseId: string, @Body() dto: CreateLessonDto, @Req() req: any) {
    return this.createLessonUseCase.execute({
      title: dto.title,
      content: dto.content,
      courseId,
      teacherId: req.user.id,
      order: dto.order,
    });
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto, @Req() req: any) {
    return this.updateLessonUseCase.execute(id, req.user.id, dto);
  }

  @Put('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async replace(@Param('id') id: string, @Body() dto: UpdateLessonDto, @Req() req: any) {
    return this.updateLessonUseCase.execute(id, req.user.id, dto);
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.deleteLessonUseCase.execute(id, req.user.id);
    return { message: 'Lesson deleted' };
  }
}
