import { BaseModel } from '../models/baseModel.js';
import { hashPassword } from '../utils/hash.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import { sendLoginCredentials } from '../services/email.service.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../helpers/jwt.js';

const Employees = BaseModel('employees');
export const EmployeeController = {
  // REGISTER PAGE
  async registerPage(req, res) {
    res.render('employees/register.ejs', {
      errors: [],
      old: {},
      success: null,
    });
  },

  // REGISTER
  async register(req, res, next) {
    try {
      const { email, password, ...rest } = req.body;
      // email Check
      const UserExist = await Employees.findBy('email', email);
      console.log(UserExist);
      if (UserExist) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('employees/register.ejs', {
            errors: [{ message: 'Email already exists' }],
            old: req.body,
            success: null,
          });
        }

        throw ApiError.badRequest('Email already exists');
      }

      // hashlash
      const hashedPassword = await hashPassword(password);
      // PASSWORD yuborish
      await sendLoginCredentials(email, password);

      const newUser = await Employees.create({
        ...rest,
        email,
        password: hashedPassword,
        role: 'teacher',
      });

      const {
        // eslint-disable-next-line no-unused-vars
        password: __,
        ...UserData
      } = newUser;

      if (req.headers.accept?.includes('text/html')) {
        return res.render('employees/register.ejs', {
          errors: [],
          old: {},
          success: `Employee ${UserData.first_name} ${UserData.last_name} created successfully!`,
        });
      }

      res.status(201).json({
        message: 'User registered successfully',
        data: UserData,
      });
    } catch (err) {
      next(err);
    }
  },
  // LOGIN PAGE
  async loginPage(req, res) {
    res.render('employees/login.ejs', { errors: [], old: {}, success: null });
  },
  // LOGIN
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const UserExist = await Employees.findBy('email', email);

      if (!UserExist) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('employees/login.ejs', {
            errors: [{ message: 'Employee not found' }],
            old: req.body,
            success: null,
          });
        }

        throw ApiError.notFound('Employee not found');
      }

      const verifyPassword = await bcrypt.compare(password, UserExist.password);
      if (!verifyPassword) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('employees/login.ejs', {
            errors: [{ message: 'Email or password is incorrect password' }],
            old: req.body,
            success: null,
          });
        }
        throw ApiError.badRequest('Email or password is incorrect');
      }
      const accessToken = generateAccessToken(UserExist, 'employee');
      const refreshToken = generateRefreshToken(UserExist, 'employee');
      res.cookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });

      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userData } = UserExist;

      if (req.headers.accept?.includes('text/html')) {
        let redirectPath;

        if (userData.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userData.role === 'teacher') {
          redirectPath = '/teacher';
        } else {
          redirectPath = '/employees/profile';
        }
        return res.redirect(redirectPath);
      }

      return res.status(200).send({
        success: true,
        message: 'Your accout logged successfully',
        data: userData,
      });
    } catch (err) {
      next(err);
    }
  },
  // UPDATE PASSWORD PAGE
  async updatePasswordPage(req, res, next) {
    try {
      if (req.headers.accept?.includes('text/html')) {
        return res.render('employees/update-password.ejs', {
          errors: [],
          success: null,
          old: {},
          user: req.user,
        });
      }
      throw ApiError.badRequest(
        'Bu sahifaga faqat brauzer orqali kirish mumkin'
      );
    } catch (err) {
      next(err);
    }
  },
  // UPDATE PASSWORD
  async updatePassword(req, res, next) {
    try {
      const { oldPassword, newPassword, confirmNewPassword } = req.body;
      const UserExist = await Employees.getById(req.user.id);

      const verifyPassword = await bcrypt.compare(
        oldPassword,
        UserExist.password
      );
      if (!verifyPassword) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('employees/update-password.ejs', {
            errors: [{ message: "Joriy parol noto'g'ri kiritilgan." }],
            old: req.body,
            success: null,
            user: req.user,
          });
        }
        throw ApiError.badRequest(
          'Try again - that is not your current password'
        );
      }

      if (newPassword !== confirmNewPassword) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('employees/update-password.ejs', {
            errors: [{ message: 'Yangi parollar mos kelmadi.' }],
            old: req.body,
            success: null,
            user: req.user,
          });
        }
        throw ApiError.badRequest(
          'New password and confirmation password must be the same.'
        );
      }

      if (oldPassword === newPassword) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('employees/update-password.ejs', {
            errors: [{ message: 'Yangi parol eskisidan farq qilishi kerak.' }],
            old: req.body,
            success: null,
            user: req.user,
          });
        }
        throw ApiError.badRequest(
          "New pasword don't have to be same with old one"
        );
      }

      // Parolni hash qilish
      const hashedPassword = await hashPassword(newPassword);

      // Parolni bazada yangilash
      await Employees.update(req.user.id, { password: hashedPassword });

      if (req.headers.accept?.includes('text/html')) {
        return res.redirect('/employees/profile');
      }

      res.status(201).send({
        success: true,
        message: 'Password updated succesfully',
      });
    } catch (err) {
      next(err);
    }
  },
  // UPDATE INFO PAGE
  async updatePage(req, res, next) {
    try {
      const loggedInUser = req.user;

      const employeeIdToFetch = req.params.employeeId || loggedInUser.id;

      const employeeData = await Employees.getById(employeeIdToFetch);

      if (!employeeData) {
        throw ApiError.notFound('Xodim topilmadi');
      }

      res.render('employees/update.ejs', {
        employee: employeeData,
        user: loggedInUser,
        errors: req.validationErrors || [],
        success: null,
      });
    } catch (err) {
      next(err);
    }
  },
  // UPDATE INFO
  async update(req, res, next) {
    try {
      if (req.validationErrors && req.validationErrors.length > 0) {
        const employeeIdToFetch = req.params.employeeId || req.user.id;
        const employeeData = await Employees.getById(employeeIdToFetch);

        return res.render('employees/update.ejs', {
          employee: employeeData,
          user: req.user,
          errors: req.validationErrors,
          old: req.oldBody,
          success: null,
        });
      }

      const { user } = req;

      const idToUpdate = req.params.employeeId || user.id;

      const targetEmployee = await Employees.getById(idToUpdate);
      if (!targetEmployee) {
        throw ApiError.notFound('Employee is not found.');
      }
      // eslint-disable-next-line no-unused-vars
      const { password, ...safeData } = req.body;
      const updatedData = safeData;

      if (Object.keys(updatedData).length === 0) {
        throw ApiError.badRequest('There is no info for update');
      }

      const updatedEmployee = await Employees.update(idToUpdate, updatedData);

      if (req.headers.accept?.includes('text/html')) {
        if (idToUpdate === user.id) {
          return res.redirect('/employees/profile');
        } else {
          return res.redirect('/employees');
        }
      }

      res.status(200).send({
        success: true,
        message: 'Employee info updated succesfully',
        data: updatedEmployee,
      });
    } catch (err) {
      next(err);
    }
  },

  //PROFILE
  async profile(req, res, next) {
    try {
      const UserExist = await Employees.getById(req.user.id);
      if (!UserExist) throw ApiError.notFound('Employee not found');

      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userData } = UserExist;

      if (req.headers.accept?.includes('text/html')) {
        return res.render('employees/dashboard.ejs', { userData });
      }

      res.status(200).json({
        success: true,
        message: 'Foydalanuvchi profili',
        data: userData,
      });
    } catch (err) {
      next(err);
    }
  },
  // UPDATE ACCESS
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

      const user = await Employees.getById(decoded.id);
      if (!user) throw ApiError.notFound('User topilmadi');

      const accessToken = generateAccessToken(user, 'employee');
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

  // DELETE PROFILE
  async delete(req, res, next) {
    try {
      const employeeId = req.params.employeeId;

      // Admin o'zini o'chira olmasligi kerak (Xavfsizlik tekshiruvi)
      if (employeeId === req.user.id) {
        throw ApiError.forbidden("Siz o'zingizni o'chira olmaysiz.");
      }

      const deletedCount = await Employees.delete(employeeId); //

      if (deletedCount === 0) {
        throw ApiError.notFound("O'chiriladigan xodim topilmadi.");
      }

      if (req.headers.accept?.includes('text/html')) {
        // Muvaffaqiyatli o'chirildi, xodimlar ro'yxatiga qaytarish
        return res.redirect('/employees');
      }

      res.status(200).send({
        success: true,
        message: "Xodim muvaffaqiyatli o'chirildi",
      });
    } catch (err) {
      next(err);
    }
  },

  // LOG OUT
  async logout(req, res, next) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      if (req.headers.accept?.includes('text/html')) {
        return res.redirect('/employees/login');
      }

      return res.send({
        success: true,
        message: 'Tizimdan muvaffaqiyatli chiqdingiz.',
      });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      next(new ApiError(500, 'Logoutda xatolik yuz berdi.'));
    }
  },
  async getAll(req, res, next) {
    try {
      const employees = await Employees.getAll();

      // Parollarni chiqarib tashlash
      const safeEmployees = employees.map((emp) => {
        // eslint-disable-next-line no-unused-vars
        const { password, ...safeData } = emp;
        return safeData;
      });

      if (req.headers.accept?.includes('text/html')) {
        // Ro'yxatni ko'rsatuvchi sahifaga yuborish
        return res.render('employees/list.ejs', {
          employees: safeEmployees,
          user: req.user,
        });
      }

      res.status(200).json({
        success: true,
        data: safeEmployees,
      });
    } catch (err) {
      next(err);
    }
  },
};
