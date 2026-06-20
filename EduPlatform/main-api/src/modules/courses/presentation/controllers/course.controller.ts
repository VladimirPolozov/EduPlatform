import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateCourseUseCase } from '../../application/use-cases/create-course.use-case';
import { GetCourseUseCase } from '../../application/use-cases/get-course.use-case';
import { UpdateCourseUseCase } from '../../application/use-cases/update-course.use-case';
import { DeleteCourseUseCase } from '../../application/use-cases/delete-course.use-case';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    private readonly deleteCourseUseCase: DeleteCourseUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async create(@Body() dto: CreateCourseDto, @Req() req: any) {
    return this.createCourseUseCase.execute({
      title: dto.title,
      description: dto.description,
      teacherId: req.user.id,
      price: dto.price,
    });
  }

  @Get()
  async findAll() {
    return this.getCourseUseCase.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getCourseUseCase.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Req() req: any) {
    return this.updateCourseUseCase.execute(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.deleteCourseUseCase.execute(id, req.user.id);
    return { message: 'Course deleted' };
  }
}
