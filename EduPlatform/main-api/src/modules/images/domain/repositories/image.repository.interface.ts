import { Image } from '../entities/image.entity';

export interface IImageRepository {
  create(image: Image): Promise<Image>;
  findById(id: string): Promise<Image | null>;
  updateStatus(id: string, status: string, processedPath?: string): Promise<void>;
}

export const IImageRepository = Symbol('IImageRepository');
