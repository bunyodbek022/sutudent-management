import db from '../db/knex.js';
import bcrypt from 'bcrypt';
import { BaseModel } from '../models/baseModel.js';
import { generateAccessToken, generateRefreshToken } from '../helpers/jwt.js';
import { ApiError } from '../utils/ApiError.js';
const Students = BaseModel('students');

export const StudentController = {
  async getLoginPage(req, res, next) {
    try {
      return res.render('student/login.ejs', {
        errors: [],
        old: {},
        success: null,
      });
    } catch (err) {
      next(err);
    }
  },
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const StudentExist = await Students.findBy('email', email);
      if (!StudentExist) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('student/login.ejs', {
            errors: [{ message: 'Talaba topilmadi yoki notogri email' }],
            old: req.body,
            success: null,
          });
        }
        throw ApiError.notFound('Student not found');
      }
      const verifyPassword = await bcrypt.compare(
        password,
        StudentExist.password
      );
      if (!verifyPassword) {
        if (req.headers.accept?.includes('text/html')) {
          return res.render('student/login.ejs', {
            errors: [{ message: 'Email yoki parol notogri' }],
            old: req.body,
            success: null,
          });
        }
        throw ApiError.badRequest('Email or password is incorrect');
      }
      const accessToken = generateAccessToken(StudentExist, 'student');
      const refreshToken = generateRefreshToken(StudentExist, 'student');
      res.cookie('accessToken', accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });
      res.cookie('refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
      });

      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userData } = StudentExist;
      if (req.headers.accept?.includes('text/html')) {
        return res.redirect('/student');
      }
      return res.status(200).send({
        success: true,
        message: 'Your account logged successfully',
        data: userData,
      });
    } catch (err) {
      next(err);
    }
  },
  async logout(req, res, next) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      if (req.headers.accept?.includes('text/html')) {
        return res.redirect('/student/login');
      }
      return res.status(200).send({
        success: true,
        message: 'Logout successful',
      });
    } catch (err) {
      next(err);
    }
  },
  async getDashboard(req, res, next) {
    try {
      const student = req.user;
      const studentId = student.id;
      const studentCourseIds = await db('student_course')
        .where('student_id', studentId)
        .pluck('course_id');
      const studentCourses = await db('course')
        .select('course.*', 'faculty.name as faculty_name')
        .leftJoin('faculty', 'course.faculty_id', 'faculty.id')
        .whereIn('course.id', studentCourseIds);
      let faculty = null;
      if (student.faculty_id) {
        faculty = await db('faculty').where('id', student.faculty_id).first();
      }

      return res.render('student/dashboard.ejs', {
        student: student,
        studentCourses: studentCourses,
        faculty: faculty,
      });
    } catch (err) {
      next(err);
    }
  },
  async getGrades(req, res, next) {
    try {
      const studentId = req.user.id;

      const grades = await db('grade')
        .where({ student_id: studentId })
        .join('course', 'grade.course_id', '=', 'course.id')
        .select(
          'course.title as course_title',
          'course.credits',
          'grade.score',
          'grade.updated_at'
        )
        .orderBy('grade.updated_at', 'desc');

      return res.render('student/grades.ejs', {
        grades,
        student: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
  async getChangePassword(req, res, next) {
    try {
      return res.render('student/change_password.ejs', {
        errors: [],
        success: null,
        student: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
  async changePassword(req, res, next) {
    try {
      const { current_password, new_password, confirm_password } = req.body;
      const studentId = req.user.id;
      const student = req.user;

      if (new_password !== confirm_password) {
        return res.render('student/change_password.ejs', {
          errors: [
            { message: 'Yangi parol va tasdiqlash paroli mos kelmadi.' },
          ],
          success: null,
          student,
        });
      }

      if (new_password.length < 6) {
        return res.render('student/change_password.ejs', {
          errors: [
            { message: 'Parol kamida 6 belgidan iborat bolishi kerak.' },
          ],
          success: null,
          student,
        });
      }

      const isMatch = await bcrypt.compare(current_password, student.password);

      if (!isMatch) {
        return res.render('student/change_password.ejs', {
          errors: [{ message: 'Joriy parol notoʻgʻri kiritildi.' }],
          success: null,
          student,
        });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);

      await Students.knex()
        .where({ id: studentId })
        .update({ password: hashedPassword, updated_at: new Date() });

      return res.render('student/change_password.ejs', {
        errors: [],
        success: 'Parolingiz muvaffaqiyatli yangilandi.',
        student,
      });
    } catch (err) {
      next(err);
    }
  },
};
