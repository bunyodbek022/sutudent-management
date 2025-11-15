/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

// CREATE ACCESS TOKEN
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    }
  );
};

// CREATE REFRESH TOKEN
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    }
  );
};

// VERIFY TOKEN
export const verifyToken = async (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new ApiError(401, 'Token yaroqsiz yoki muddati tugagan');
  }
};
