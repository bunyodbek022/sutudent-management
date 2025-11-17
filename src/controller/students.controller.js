import { BaseModel } from '../models/baseModel.js';
import { hashPassword } from '../utils/hash.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import { sendVerificationCode } from '../services/email.service.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../helpers/jwt.js';

const Users = BaseModel('users');
export const authStudents = {
  async register(req, res, next) {
    try {
      const { email, password, ...rest } = req.body;
      // email Check
      const UserExist = await Users.findBy('email', email);
      console.log(UserExist);
      if (UserExist) {
        throw ApiError.badRequest('Email already exists');
      }
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      // hashlash
      const hashedPassword = await hashPassword(password);

      // verification code yuborish

      if (req.body.role === 'admin') {
        await sendVerificationCode(email, verificationCode);
      }

      const admin = await Users.findBy('role', 'admin');

      await sendVerificationCode(admin.email, verificationCode);

      const newUser = await Users.create({
        ...rest,
        email,
        password: hashedPassword,
        verification_code: verificationCode,
      });

      const {
        // eslint-disable-next-line no-unused-vars
        password: __,
        verificationCode: _,
        verified_at,
        ...UserData
      } = newUser;

      res.status(201).json({
        message: 'User registered successfully',
        data: UserData,
      });
    } catch (err) {
      next(err);
    }
  },

  async verifyUser(req, res, next) {
    try {
      const { email, code } = req.body;
      const UserExist = await Users.findBy('email', email);
      if (!UserExist) throw ApiError.notFound('Employee not found');

      if (UserExist.verification_code !== code) {
        throw ApiError.badRequest('Invalid verification code');
      }
      if (UserExist.status === 'active') {
        res.status(200).send({
          success: true,
          message: 'User allaqachon faollashgan',
        });
      }

      await Users.update(UserExist.id, {
        status: 'active',
        verification_code: null,
        verified_at: new Date(),
      });

      res.status(200).send({
        success: true,
        message: 'Employee verified successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const UserExist = await Users.findBy('email', email);
      if (!UserExist) throw ApiError.notFound('Employee not found');

      if (UserExist.status === 'inactive') {
        throw ApiError.unauthorized('Employee is not verified');
      }

      const verifyPassword = await bcrypt.compare(password, UserExist.password);
      if (!verifyPassword) {
        throw ApiError.badRequest('Email or password is incorrect');
      }
      const accessToken = generateAccessToken(UserExist);
      const refreshToken = generateRefreshToken(UserExist);
      res.cookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });

      // eslint-disable-next-line no-unused-vars
      const { password: _, verification_code, ...userData } = UserExist;
      res.status(200).send({
        success: true,
        message: "Siz logindan muvaffaqqiyatli o'tdingiz!",
        data: userData,
      });
    } catch (err) {
      next(err);
    }
  },

  async profile(req, res, next) {
    try {
      const UserExist = await Users.getById(req.user.id);
      if (!UserExist) throw ApiError.notFound('Employee not found');
      delete UserExist.password;
      UserExist.verification_code = null;
      delete UserExist.verification_code;
      res.status(200).json({
        success: true,
        message: 'Foydalanuvchi profili',
        data: UserExist,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateAccess(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw ApiError.unauthorized("Refresh token yo'q");
      }

      const decoded = await verifyToken(
        refreshToken,
        // eslint-disable-next-line no-undef
        process.env.JWT_REFRESH_SECRET
      );

      const user = await Users.getById(decoded.id);
      if (!user) throw ApiError.notFound('User topilmadi');

      const accessToken = generateAccessToken(user);
      res.cookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: 'Access token yangilandi',
        data: { accessToken },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteProfile(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) throw ApiError.unauthorized('User hali login qilmagan');

      const deletedUser = await Users.delete(userId);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).send({
        success: true,
        message: `Foydalanuvchi ${deletedUser.email} muvaffaqiyatli o'chirildi.`,
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      res.clearCookie('accesToken');
      res.clearCookie('refreshToken');
      return res.send({
        success: true,
        message: 'Tizimdan muvaffaqiyatli chiqdingiz.',
      });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      next(new ApiError(500, 'Logoutda xatolik yuz berdi.'));
    }
  },
};
