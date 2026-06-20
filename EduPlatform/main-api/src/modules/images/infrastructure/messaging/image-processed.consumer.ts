import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IImageRepository } from '../../domain/repositories/image.repository.interface';
import { KafkaService } from './kafka.service';

@Injectable()
export class ImageProcessedConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    @Inject(IImageRepository)
    private readonly imageRepository: IImageRepository,
  ) {}

  async onModuleInit() {
    await this.kafkaService.consume('image.processed', async (message) => {
      const { imageId, processedPath } = message as { imageId: string; processedPath?: string };
      if (imageId) {
        await this.imageRepository.updateStatus(imageId, 'ready', processedPath);
      }
    });
  }
}
