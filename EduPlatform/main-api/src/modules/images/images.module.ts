import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageController } from './presentation/controllers/image.controller';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { IImageRepository } from './domain/repositories/image.repository.interface';
import { ImageDocumentClass, ImageSchema } from './infrastructure/database/image.schema';
import { MongooseImageRepository } from './infrastructure/database/mongoose-image.repository';
import { KafkaService } from './infrastructure/messaging/kafka.service';
import { ImageProcessedConsumer } from './infrastructure/messaging/image-processed.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageDocumentClass.name, schema: ImageSchema },
    ]),
    AuthModule,
    ConfigModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [ImageController],
  providers: [
    {
      provide: IImageRepository,
      useClass: MongooseImageRepository,
    },
    KafkaService,
    UploadImageUseCase,
    ImageProcessedConsumer,
  ],
})
export class ImagesModule {}
