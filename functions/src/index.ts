import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import Fastify from 'fastify';
import fastifyExpress from '@fastify/express';
import cors from '@fastify/cors';
import userRouter from './routes/userRouter.ts';
import { firebaseConfig } from './firebaseConfig.ts';

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

const app = Fastify({ logger: true });

await app.register(cors);
await app.register(fastifyExpress);
await app.register(userRouter, { prefix: '/api/user' });

const start = async () => {
    try {
        await app.listen({ port: 5000 });
        app.log.info('server listening on 5000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();

export const identityServer = onRequest((req, res) => {
    app.express(req, res);
});

export { db };
