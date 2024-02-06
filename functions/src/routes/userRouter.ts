import { FastifyInstance } from 'fastify';
import { login, signUp, sendPasswordResetEmail, resetPassword } from '../controllers';
import { loginSchema, signupSchema, sendEmailSchema, passwordResetSchema } from '../models';

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
        url: '/password-reset',
        schema: sendEmailSchema,
        handler: sendPasswordResetEmail,
    });

    fastify.route({
        method: 'PATCH',
        url: '/password-reset/:userId',
        schema: passwordResetSchema,
        handler: resetPassword,
    });
};

export default userRoter;
