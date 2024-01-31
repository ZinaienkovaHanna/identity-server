import { FastifyReply } from 'fastify';
import { ERROR500 } from './constants.ts';

export const handleServerError = (res: FastifyReply, error: any) => {
    return res.status(ERROR500.statusCode).send(ERROR500);
};

export const ERRORS = {
    invalidToken: new Error('Token is invalid.'),
    userExists: new Error('User already exists'),
    userNotExists: new Error('User not exists'),
    userCredError: new Error('Invalid credential'),
    tokenError: new Error('Invalid Token'),
};
