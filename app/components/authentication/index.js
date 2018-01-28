import bcrypt from 'bcrypt';

export const generateHash = async (password) => await bcrypt.hash(password, +process.env.AUTH_SALT_ROUNDS);

export const comparePasswords = async (password, hash) => await bcrypt.compare(password, hash);
