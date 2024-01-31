import * as firebase from 'firebase/app';
import { onRequest } from 'firebase-functions/v2/https';
import Fastify from 'fastify';
import env from '@fastify/env';
import fastifyExpress from '@fastify/express';
import cors from '@fastify/cors';
import bcrypt from 'fastify-bcrypt';
import { firebaseConfig } from './firebaseConfig.ts';
import { schema } from './envSchema.ts';

firebase.initializeApp(firebaseConfig);

const app = Fastify({ logger: true });

await app.register(cors);
await app.register(fastifyExpress);
await app.register(env, {
    schema: schema,
    dotenv: true,
});
await app.register(bcrypt as any, {
    saltWorkFactor: 12,
});

app.get('/', async (request, reply) => {
    reply.send({ hello: 'world' });
});

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
