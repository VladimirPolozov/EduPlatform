import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/eduplatform',
  kafkaBrokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  kafkaGroupId: process.env.KAFKA_GROUP_ID ?? 'image-worker',
};
