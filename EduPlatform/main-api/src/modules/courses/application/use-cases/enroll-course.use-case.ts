import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';

@Injectable()
export class EnrollCourseUseCase {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(courseId: string, studentId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const student = await this.userRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.enrolledCourses.includes(courseId)) {
      throw new ConflictException('Already enrolled in this course');
    }

    await this.userRepository.addEnrolledCourse(studentId, courseId);
  }
}
