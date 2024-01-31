import bcrypt from 'bcryptjs';

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
