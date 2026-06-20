import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { UserDocumentClass, UserSchema } from './infrastructure/database/user.schema';
import { MongooseUserRepository } from './infrastructure/database/mongoose-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocumentClass.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: IUserRepository,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [IUserRepository, MongooseModule],
})
export class UsersModule {}
