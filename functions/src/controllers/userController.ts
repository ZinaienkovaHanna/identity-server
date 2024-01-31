import { FastifyReply, FastifyRequest } from 'fastify';
import { getDocs, collection, addDoc, where, query } from 'firebase/firestore';
import JWT from 'jsonwebtoken';
import { db } from '../index.ts';
import { handleServerError, ERRORS } from '../helpers/errors.ts';
import { STANDARD, ERROR409, ERROR400 } from '../helpers/constants.ts';
import { compareHash, hashPassword } from '../helpers/utils.ts';

export const login = async (
    req: FastifyRequest<{ Body: { email: string; password: string } }>,
    res: FastifyReply
) => {
    try {
        const { email, password } = req.body;

        const userQuery = query(collection(db, 'users'), where('email', '==', email));

        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            res.code(ERROR400.statusCode).send(ERRORS.userNotExists);
        }

        const user = userSnapshot.docs[0].data();

        const checkPassword = await compareHash(password, user.password);

        if (!checkPassword) {
            res.code(ERROR400.statusCode).send(ERRORS.userCredError);
        }

        if (process.env.JWT_SECRET === undefined) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = JWT.sign(
            {
                id: user.id,
                email,
            },
            process.env.JWT_SECRET
        );

        res.code(STANDARD.SUCCESS).send({
            token,
            user: {
                email,
                name: user.name,
            },
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const signUp = async (
    req: FastifyRequest<{ Body: { email: string; password: string; name: string } }>,
    res: FastifyReply
) => {
    try {
        const { email, password, name } = req.body;

        const userQuery = query(collection(db, 'users'), where('email', '==', email));

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
            res.code(ERROR409.statusCode).send(ERRORS.userExists);
        }

        const hashedPassword = await hashPassword(10, password);

        const userRef = await addDoc(collection(db, 'users'), {
            email,
            name,
            password: hashedPassword,
        });

        console.log('Document written with ID: ', userRef.id);

        if (process.env.JWT_SECRET === undefined) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = JWT.sign(
            {
                id: userRef.id,
                email,
            },
            process.env.JWT_SECRET
        );

        res.code(STANDARD.SUCCESS).send({
            token,
            user: {
                email,
                name,
            },
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const resetPassword = (req: FastifyRequest, res: FastifyReply) => {
    try {
        console.log('update user');
    } catch (error) {
        handleServerError(res, error);
    }
};
