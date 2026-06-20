"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const database_1 = require("./database");
const producer_1 = require("./kafka/producer");
const consumer_1 = require("./kafka/consumer");
async function main() {
    await (0, database_1.connectDatabase)();
    await (0, producer_1.connectProducer)();
    await (0, consumer_1.startConsumer)();
    const app = (0, express_1.default)();
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    app.listen(config_1.config.port, () => {
        console.log(`Image worker listening on port ${config_1.config.port}`);
    });
}
main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
