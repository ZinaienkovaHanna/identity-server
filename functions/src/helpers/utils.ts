import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const hashPassword = async (saltRounds, password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

export const compareHash = async (password, hash) => {
    try {
        const result = await bcrypt.compare(password, hash);
        return result;
    } catch (error) {
        console.error('Error comparing hash and password:', error);
    }
};

export const generateToken = (id: string, email: string): string => {
    if (process.env.JWT_SECRET === undefined) throw new Error('JWT_SECRET is not defined');

    const expiresIn = '1h';

    return JWT.sign({ id, email }, process.env.JWT_SECRET, { expiresIn });
};

export const generateResetLink = (userId: string, email: string) => {
    const resetToken = generateToken(userId, email);
    // FIXME:
    const resetLink = `http://localhost:5000/api/user/password-reset/${userId}?token=${resetToken}`;

    return resetLink;
};

export const sendEmail = async (email: string, resetLink: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'Password Reset Instructions',
            text: `To reset your password, click on the following link: ${resetLink}`,
        });

        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};
