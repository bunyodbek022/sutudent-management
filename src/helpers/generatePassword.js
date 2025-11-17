import crypto from 'crypto';

export const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex'); // 8 ta belgidan iborat parol
};
