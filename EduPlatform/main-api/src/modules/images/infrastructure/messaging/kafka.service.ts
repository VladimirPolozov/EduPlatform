import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly admin: Admin;

  constructor(configService: ConfigService) {
    const brokers = (configService.get<string>('kafkaBrokers') ?? 'localhost:9092').split(',');
    this.kafka = new Kafka({
      clientId: 'main-api',
      brokers,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'main-api-group' });
    this.admin = this.kafka.admin();
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.admin.connect();
    await this.admin.createTopics({
      topics: [
        { topic: 'image.uploaded', numPartitions: 1 },
        { topic: 'image.processed', numPartitions: 1 },
      ],
    });
    await this.admin.disconnect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async emit(topic: string, message: Record<string, unknown>): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async consume(topic: string, callback: (message: Record<string, unknown>) => Promise<void>): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString());
          await callback(data);
        }
      },
    });
  }
}
