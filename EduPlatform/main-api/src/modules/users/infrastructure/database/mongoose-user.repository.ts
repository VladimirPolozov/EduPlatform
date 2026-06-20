import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserDocument, UserDocumentClass } from './user.schema';

@Injectable()
export class MongooseUserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserDocumentClass.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private mapToDomain(doc: UserDocument): User {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      enrolledCourses: doc.enrolledCourses.map((id) => id.toString()),
    });
  }

  async create(user: User): Promise<User> {
    const created = new this.userModel({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      enrolledCourses: user.enrolledCourses || [],
    });
    const saved = await created.save();
    return this.mapToDomain(saved);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) {
      return null;
    }
    return this.mapToDomain(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return this.mapToDomain(doc);
  }
}
