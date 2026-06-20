import { Kafka, Consumer } from 'kafkajs';
import { config } from '../config';
import { processImage } from '../image/processor';
import { updateImageStatus } from '../database';
import { emitProcessed } from './producer';

let consumer: Consumer;

export async function startConsumer(): Promise<void> {
  const kafka = new Kafka({ clientId: 'image-worker', brokers: config.kafkaBrokers });
  consumer = kafka.consumer({ groupId: config.kafkaGroupId });
  await consumer.connect();
  console.log('Kafka consumer connected');

  await consumer.subscribe({ topic: 'image.uploaded', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const { imageId, filepath, filename } = JSON.parse(message.value.toString()) as {
        imageId: string;
        filepath: string;
        filename: string;
      };

      console.log(`Processing image ${imageId}: ${filename}`);

      try {
        const processedPath = await processImage(filepath, filename);
        await updateImageStatus(imageId, 'ready', processedPath);
        await emitProcessed(imageId, processedPath);
        console.log(`Image ${imageId} processed successfully`);
      } catch (err) {
        console.error(`Failed to process image ${imageId}:`, err);
        await updateImageStatus(imageId, 'failed');
      }
    },
  });
}
