import { Inject, Injectable } from '@nestjs/common';
import { IImageRepository } from '../../domain/repositories/image.repository.interface';
import { Image } from '../../domain/entities/image.entity';
import { KafkaService } from '../../infrastructure/messaging/kafka.service';

@Injectable()
export class UploadImageUseCase {
  constructor(
    @Inject(IImageRepository)
    private readonly imageRepository: IImageRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async execute(data: { filename: string; filepath: string; courseId: string; uploadedBy: string }): Promise<Image> {
    const image = new Image({
      filename: data.filename,
      filepath: data.filepath,
      courseId: data.courseId,
      uploadedBy: data.uploadedBy,
      status: 'processing',
    });

    const saved = await this.imageRepository.create(image);

    await this.kafkaService.emit('image.uploaded', {
      imageId: saved.id,
      filepath: saved.filepath,
      filename: saved.filename,
    });

    return saved;
  }
}
