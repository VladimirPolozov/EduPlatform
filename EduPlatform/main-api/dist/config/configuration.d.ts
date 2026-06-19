declare const _default: () => {
    port: number;
    mongodbUri: string;
    redisUrl: string;
    kafkaBrokers: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
};
export default _default;
