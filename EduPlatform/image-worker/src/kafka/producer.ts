import { Kafka, Producer } from 'kafkajs';
import { config } from '../config';

let producer: Producer;

export async function connectProducer(): Promise<void> {
  const kafka = new Kafka({ clientId: 'image-worker', brokers: config.kafkaBrokers });
  producer = kafka.producer();
  await producer.connect();
  console.log('Kafka producer connected');
}

export async function emitProcessed(imageId: string, processedPath: string): Promise<void> {
  await producer.send({
    topic: 'image.processed',
    messages: [{ value: JSON.stringify({ imageId, processedPath }) }],
  });
}
