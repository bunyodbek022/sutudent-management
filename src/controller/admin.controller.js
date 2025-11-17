import { BaseModel } from '../models/baseModel.js';
import { ApiError } from '../utils/ApiError.js';
const Employees = BaseModel('employees');
// const Students = BaseModel('students');
const Faculties = BaseModel('faculty');
const Courses = BaseModel('course');
// const Grades = BaseModel('grade');

export const AdminController = {
  // Admin Dashboard ma'lumotlarini ko'rsatish
  async getDashboard(req, res, next) {
    try {
      const loggedInUser = req.user; // req.user - tizimga kirgan Admin
      // Admin dashboard uchun qo'shimcha ma'lumotlarni olish mumkin (Masalan, Umumiy Statistika)
      const totalEmployees = await Employees.count();
      const totalFaculties = await Faculties.count();

      if (req.headers.accept?.includes('text/html')) {
        return res.render('admin/dashboard.ejs', {
          user: loggedInUser,
          stats: { totalEmployees, totalFaculties },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Admin Dashboard data',
        data: { loggedInUser, stats: { totalEmployees } },
      });
    } catch (err) {
      next(err);
    }
  },
  // R: READ ALL - /admin/faculties
  async getAllFaculties(req, res, next) {
    try {
      const faculties = await Faculties.getAll();
      return res.render('admin/faculties/list.ejs', {
        faculties,
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  },

  // CREATE - /admin/faculties/create (GET)
  async createFacultyPage(req, res, next) {
    try {
      return res.render('admin/faculties/create.ejs', {
        user: req.user,
        errors: [],
        old: {},
        success: null,
      });
    } catch (err) {
      next(err);
    }
  },

  // C: CREATE (Ma'lumotni saqlash) - /admin/faculties (POST)
  async createFaculty(req, res, next) {
    try {
      // Validatsiya xatolarini tekshirish (validate middleware'idan keladi)
      if (req.validationErrors && req.validationErrors.length > 0) {
        return res.render('admin/faculties/create.ejs', {
          errors: req.validationErrors,
          old: req.oldBody,
          user: req.user,
          success: null,
        });
      }

      // eslint-disable-next-line no-unused-vars
      const newFaculty = await Faculties.create(req.body);

      return res.redirect('/admin/faculties');
    } catch (err) {
      next(err);
    }
  },

  // UPDATE (Tahrirlash formasi) - /admin/faculties/:id/edit (GET)
  async updateFacultyPage(req, res, next) {
    try {
      const facultyId = req.params.id;
      const faculty = await Faculties.getById(facultyId);

      if (!faculty) {
        throw ApiError.notFound('Fakultet topilmadi.');
      }

      return res.render('admin/faculties/edit.ejs', {
        faculty,
        user: req.user,
        errors: req.validationErrors || [],
        success: null,
      });
    } catch (err) {
      next(err);
    }
  },

  // U: UPDATE (Ma'lumotni yangilash) - /admin/faculties/:id/edit (POST)
  async updateFaculty(req, res, next) {
    try {
      // Validatsiya tekshiruvi
      if (req.validationErrors && req.validationErrors.length > 0) {
        // ... xatolar bilan qayta render qilish
        const faculty = await Faculties.getById(req.params.id);
        return res.render('admin/faculties/edit.ejs', {
          faculty,
          errors: req.validationErrors,
          old: req.oldBody,
          user: req.user,
          success: null,
        });
      }

      await Faculties.update(req.params.id, req.body);
      return res.redirect('/admin/faculties');
    } catch (err) {
      next(err);
    }
  },

  // D: DELETE (O'chirish) - /admin/faculties/:id/delete (POST)
  async deleteFaculty(req, res, next) {
    try {
      await Faculties.delete(req.params.id);
      return res.redirect('/admin/faculties');
    } catch (err) {
      next(err);
    }
  },

  //READ ALL (Ro'yxatni ko'rish) - /admin/courses
  async getAllCourses(req, res, next) {
    try {
      // Kurs ro'yxatini va ularga tegishli fakultet nomini olish (JOIN)
      const courses = await Courses.knex()
        .select('course.*', 'faculty.name as faculty_name')
        .leftJoin('faculty', 'course.faculty_id', '=', 'faculty.id');

      return res.render('admin/courses/list.ejs', { courses, user: req.user });
    } catch (err) {
      next(err);
    }
  },

  // CREATE (Yaratish formasi) - /admin/courses/create (GET)
  async createCoursePage(req, res, next) {
    try {
      const faculties = await Faculties.getAll();
      return res.render('admin/courses/create.ejs', {
        user: req.user,
        faculties,
        errors: [],
        old: {},
      });
    } catch (err) {
      next(err);
    }
  },

  // CREATE (Ma'lumotni saqlash) - /admin/courses (POST)
  async createCourse(req, res, next) {
    try {
      if (req.validationErrors && req.validationErrors.length > 0) {
        const faculties = await Faculties.getAll();
        return res.render('admin/courses/create.ejs', {
          errors: req.validationErrors,
          old: req.oldBody,
          user: req.user,
          faculties,
        });
      }

      await Courses.create(req.body);
      return res.redirect('/admin/courses');
    } catch (err) {
      next(err);
    }
  },

  // UPDATE (Tahrirlash formasi) - /admin/courses/:id/edit (GET)
  async updateCoursePage(req, res, next) {
    try {
      const courseId = req.params.id;
      const course = await Courses.getById(courseId);
      const faculties = await Faculties.getAll();

      if (!course) {
        throw ApiError.notFound('Kurs topilmadi.');
      }

      return res.render('admin/courses/edit.ejs', {
        course,
        faculties,
        user: req.user,
        errors: req.validationErrors || [],
        success: null,
      });
    } catch (err) {
      next(err);
    }
  },

  // UPDATE (Ma'lumotni yangilash) - /admin/courses/:id/edit
  async updateCourse(req, res, next) {
    try {
      if (req.validationErrors && req.validationErrors.length > 0) {
        const course = await Courses.getById(req.params.id);
        const faculties = await Faculties.getAll();
        return res.render('admin/courses/edit.ejs', {
          course,
          faculties,
          errors: req.validationErrors,
          old: req.oldBody,
          user: req.user,
        });
      }

      await Courses.update(req.params.id, req.body);
      return res.redirect('/admin/courses');
    } catch (err) {
      next(err);
    }
  },

  // DELETE (O'chirish) - /admin/courses/:id/delete
  async deleteCourse(req, res, next) {
    try {
      await Courses.delete(req.params.id);
      return res.redirect('/admin/courses');
    } catch (err) {
      next(err);
    }
  },
};
