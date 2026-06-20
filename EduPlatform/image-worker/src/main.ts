import express from 'express';
import { config } from './config';
import { connectDatabase } from './database';
import { connectProducer } from './kafka/producer';
import { startConsumer } from './kafka/consumer';

async function main() {
  await connectDatabase();
  await connectProducer();
  await startConsumer();

  const app = express();
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(config.port, () => {
    console.log(`Image worker listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
