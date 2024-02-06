import { onRequest } from 'firebase-functions/v2/https';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import userRouter from './routes';

const fastify = Fastify({ logger: true });

fastify.addContentTypeParser('application/json', {}, (req, body: any, done) => {
    done(null, body.body);
});
fastify.register(cors);
fastify.register(userRouter, { prefix: '/api/user' });

export const identityServer = onRequest(async (req, res) => {
    try {
        await fastify.ready();
        fastify.server.emit('request', req, res);
    } catch (error) {
        console.error('Error starting Fastify:', error);
        res.status(500).send('Internal Server Error');
    }
});
