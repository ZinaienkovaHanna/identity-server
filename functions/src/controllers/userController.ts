import { FastifyReply, FastifyRequest } from 'fastify';
import {
    getDocs,
    addDoc,
    updateDoc,
    collection,
    where,
    query,
    getDoc,
    doc,
} from 'firebase/firestore';
import { handleServerError, ERRORS } from '../helpers/errors';
import { STANDARD, ERROR409, ERROR400 } from '../helpers/constants';
import {
    compareHash,
    hashPassword,
    generateToken,
    generateResetLink,
    sendEmail,
} from '../helpers/utils';
import { db } from '../firebase';

export const login = async (
    req: FastifyRequest<{ Body: { email: string; password: string } }>,
    res: FastifyReply
) => {
    try {
        const { email, password } = req.body;

        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) res.code(ERROR400.statusCode).send(ERRORS.userNotExists);

        const user = querySnapshot.docs[0].data();
        const checkPassword = await compareHash(password, user.password);

        if (!checkPassword) res.code(ERROR400.statusCode).send(ERRORS.userCredError);

        const token = generateToken(user.id, email);

        res.code(STANDARD.SUCCESS).send({
            token,
            user: {
                email: user.email,
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

        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) res.code(ERROR409.statusCode).send(ERRORS.userExists);

        const hashedPassword = await hashPassword(10, password);

        const userRef = await addDoc(collection(db, 'users'), {
            email,
            name,
            password: hashedPassword,
        });

        const token = generateToken(userRef.id, email);

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

export const sendPasswordResetEmail = async (
    req: FastifyRequest<{ Body: { email: string } }>,
    res: FastifyReply
) => {
    try {
        const { email } = req.body;

        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) res.code(ERROR400.statusCode).send(ERRORS.userNotExists);

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();
        const resetLink = generateResetLink(userDoc.id, user.email);

        sendEmail(user.email, resetLink);

        res.code(STANDARD.SUCCESS).send({
            message: 'Instructions for password reset sent to your email.',
            resetLink,
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const resetPassword = async (
    req: FastifyRequest<{
        Params: { userId: string };
        Body: { newPassword: string };
    }>,
    res: FastifyReply
) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();

        if (!userSnap.exists() || !user) {
            res.code(ERROR400.statusCode).send(ERRORS.userNotExists);
            return;
        }

        const hashedPassword = await hashPassword(10, newPassword);

        await updateDoc(userRef, { password: hashedPassword });

        const newToken = generateToken(userSnap.id, user.email);

        res.code(STANDARD.SUCCESS).send({
            token: newToken,
            user: {
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        handleServerError(res, error);
    }
};
