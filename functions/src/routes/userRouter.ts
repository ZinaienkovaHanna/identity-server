import { FastifyInstance } from 'fastify';
import { login, signUp, resetPassword } from '../controllers/userController.ts';
import { loginSchema, signupSchema, resetPasswordSchema } from '../models/userSchema.ts';

const userRoter = async (fastify: FastifyInstance) => {
    fastify.decorateRequest('authUser', '');

    fastify.route({
        method: 'POST',
        url: '/login',
        schema: loginSchema,
        handler: login,
    });

    fastify.route({
        method: 'POST',
        url: '/signup',
        schema: signupSchema,
        handler: signUp,
    });

    fastify.route({
        method: 'POST',
        url: '/reset-password',
        schema: resetPasswordSchema,
        handler: resetPassword,
    });
};

export default userRoter;
