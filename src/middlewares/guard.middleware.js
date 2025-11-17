/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { verifyToken } from '../helpers/jwt.js';
import { BaseModel } from '../models/baseModel.js';
import { ApiError } from '../utils/ApiError.js';

const Employees = BaseModel('employees');

// AUTH GUARD
export const authGuard = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(ApiError.unauthorized('Access token is missing'));
    }

    const verified = await verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const user = await Employees.getById(verified.id);

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

// REFRESH GUARD
export const refreshGuard = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return next(ApiError.unauthorized('Refresh token is missing'));
    }

    const decoded = await verifyToken(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(ApiError.unauthorized('Invalid or expired refresh token'));
  }
};

// ROLE GUARD
export const roleGuard = (...roles) => {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

    console.log({ user: req.user });

    if (userRoles.includes('admin')) return next();

    const hasAccess = userRoles.some((r) => roles.includes(r));

    if (!hasAccess) {
      return next(
        ApiError.badRequest('You do not have access to this resource')
      );
    }

    next();
  };
};

// SELF GUARD
export const selfGuard = (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    if (id == userId || role === 'admin') {
      return next();
    }

    return next(
      ApiError.forbidden('You are not allowed to perform this action')
    );
  } catch (error) {
    return next(error);
  }
};
