"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/eduplatform',
    redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
    kafkaBrokers: process.env.KAFKA_BROKERS ?? 'localhost:9092',
    jwt: {
        secret: process.env.JWT_SECRET ?? 'change-me',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    },
});
//# sourceMappingURL=configuration.js.map