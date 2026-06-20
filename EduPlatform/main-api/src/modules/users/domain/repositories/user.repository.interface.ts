import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  addEnrolledCourse(userId: string, courseId: string): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
