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
      return next(new ApiError(401, 'Token mavjud emas'));
    }

    const verified = await verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const user = await Employees.getById(verified.id);
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
export const refreshGuard = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next(new ApiError(401, 'Refresh token mavjud emas'));
    }
    const decoded = await verifyToken(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, 'Refresh token yaroqsiz yoki muddati tugagan'));
  }
};
// ROLE GUARD
export const roleGuard = (...role) => {
  //['users', 'employees', 'teachers']
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

    console.log({ user: req.user });
    console.log({ userRoles });
    console.log({ role });
    if (userRoles.includes('admin')) return next();
    const hasAccess = userRoles.some((r) => role.includes(r));
    if (!hasAccess) {
      return next(
        new Error('Sizning rolingiz ushbu yonalishga kirish huquqiga ega emas')
      );
    }
    next();
  };
};

//SELF GUARD
export const selfGuard = (req, res, next) => {
  try {
    let { id } = req.params;
    let { role } = req.user;
    if (id == req.user.id || role == 'admin') {
      next();
      return;
    }
    res.status(405).send({ message: 'Not allowed !' });
  } catch (error) {
    return next(error);
  }
};
