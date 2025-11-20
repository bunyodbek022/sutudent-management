import { BaseModel } from '../models/baseModel.js';
import { ApiError } from '../utils/ApiError.js';
import { generatePassword } from '../helpers/generatePassword.js';
import { hashPassword } from '../utils/hash.js';
import { sendLoginCredentials } from '../services/email.service.js';
import db from '../db/knex.js';
const Employees = BaseModel('employees');
const Students = BaseModel('students');
const Faculties = BaseModel('faculty');
const Courses = BaseModel('course');
const CourseTeacher = BaseModel('course_teacher');
// const Grades = BaseModel('grade');

export const AdminController = {
  // Admin Dashboard ma'lumotlarini ko'rsatish
  async getDashboard(req, res, next) {
    try {
      const loggedInUser = req.user; // req.user - tizimga kirgan Admin
      // Admin dashboard uchun qo'shimcha ma'lumotlarni olish mumkin (Masalan, Umumiy Statistika)
      const totalEmployees = await Employees.count();
      const totalFaculties = await Faculties.count();
      const totalStudents = await Students.count();
      const totalCourses = await Courses.count();

      if (req.headers.accept?.includes('text/html')) {
        return res.render('admin/dashboard.ejs', {
          user: loggedInUser,
          stats: {
            totalEmployees,
            totalFaculties,
            totalStudents,
            totalCourses,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Admin Dashboard data',
        data: {
          loggedInUser,
          stats: {
            totalEmployees,
            totalStudents,
            totalCourses,
            totalFaculties,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  },
  //--------------------FACULTY-------------------------------------

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
  // -----------------------------COURSES---------------------------------------
  //READ ALL (Ro'yxatni ko'rish) - /admin/courses
  async getAllCourses(req, res, next) {
    try {
      // 1. Barcha kurslar va ularning Fakultetlarini olish
      const courses = await Courses.knex()
        .select('course.*', 'faculty.name as faculty_name')
        .leftJoin('faculty', 'course.faculty_id', '=', 'faculty.id');

      // 2. Barcha kurs-o'qituvchi tayinlanishlarini olish (o'qituvchi ma'lumotlari bilan)
      const allAssignments = await CourseTeacher.knex()
        .select(
          'course_teacher.course_id',
          'employees.first_name',
          'employees.last_name'
        )
        .join('employees', 'course_teacher.employee_id', '=', 'employees.id');

      // 3. Ma'lumotlarni birlashtiri
      const courseTeacherMap = new Map();

      allAssignments.forEach((assignment) => {
        const fullName = `${assignment.first_name} ${assignment.last_name}`;
        if (!courseTeacherMap.has(assignment.course_id)) {
          courseTeacherMap.set(assignment.course_id, []);
        }
        courseTeacherMap.get(assignment.course_id).push(fullName);
      });

      //Birlashtirilgan ma'lumotni har bir kurs obyektiga qo'shish
      const coursesWithTeachers = courses.map((course) => ({
        ...course,
        teachers: courseTeacherMap.get(course.id) || [],
      }));

      return res.render('admin/courses/list.ejs', {
        courses: coursesWithTeachers,
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
  // CREATE (Yaratish formasi) - /admin/courses/create (GET)
  async createCoursePage(req, res, next) {
    try {
      const faculties = await Faculties.getAll();
      const employees = await Employees.getAll();
      return res.render('admin/courses/create.ejs', {
        user: req.user,
        faculties,
        employees,
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
        const employees = await Employees.getAll();
        return res.render('admin/courses/create.ejs', {
          errors: req.validationErrors,
          old: req.oldBody,
          user: req.user,
          faculties,
          employees,
        });
      }
      const {
        teacher_ids = [], // teacher_ids ni massiv yoki bo'sh massiv sifatida olamiz
        title,
        credits,
        faculty_id,
        description,
      } = req.body;

      const courseData = { title, credits, faculty_id, description };
      const newCourse = await Courses.create(courseData);
      const newCourseId = newCourse.id;

      if (teacher_ids.length > 0) {
        const teachersArray = Array.isArray(teacher_ids)
          ? teacher_ids
          : [teacher_ids];

        const assignments = teachersArray.map((id) => ({
          course_id: newCourseId,
          employee_id: id,
        }));
        await CourseTeacher.knex().insert(assignments);
      }
      return res.redirect('/admin/courses');
    } catch (err) {
      next(err);
    }
  },

  // UPDATE (Tahrirlash formasi) - /admin/courses/:id/edit (GET)
  async updateCoursePage(req, res, next) {
    try {
      const courseId = req.params.id;
      const [course, faculties, employees, currentTeachers] = await Promise.all(
        [
          Courses.getById(courseId),
          Faculties.getAll(),
          Employees.getAll(),
          CourseTeacher.knex()
            .where({ course_id: courseId })
            .select('employee_id'),
        ]
      );

      if (!course) {
        return res.status(404).send('Kurs topilmadi.');
      }

      // Tayinlangan o'qituvchilar IDlarini massivga aylantiramiz
      const assignedTeacherIds = currentTeachers.map((t) => t.employee_id);

      return res.render('admin/courses/edit.ejs', {
        course,
        faculties,
        employees,
        assignedTeacherIds, // Tayinlangan IDlar ro'yxati
        user: req.user,
        errors: req.validationErrors || [],
        old: {},
      });
    } catch (err) {
      next(err);
    }
  },
  // UPDATE (Ma'lumotni yangilash) - /admin/courses/:id/edit
  async updateCourse(req, res, next) {
    try {
      const courseId = req.params.id;

      //Validatsiya xatolarini tekshirish
      if (req.validationErrors && req.validationErrors.length > 0) {
        const [faculties, employees] = await Promise.all([
          Faculties.getAll(),
          Employees.getAll(),
        ]);
        const course = await Courses.getById(courseId);

        const currentTeachers = await CourseTeacher.knex()
          .where({ course_id: courseId })
          .select('employee_id');
        const assignedTeacherIds = currentTeachers.map((t) => t.employee_id);

        return res.render('admin/courses/edit.ejs', {
          course,
          faculties,
          employees,
          assignedTeacherIds,
          errors: req.validationErrors,
          old: req.oldBody,
          user: req.user,
        });
      }
      const {
        teacher_ids = [],
        title,
        credits,
        faculty_id,
        description,
      } = req.body;

      const courseData = { title, credits, faculty_id, description };
      await Courses.update(courseId, courseData);
      await CourseTeacher.knex().where({ course_id: courseId }).del();

      if (teacher_ids.length > 0) {
        const teachersArray = Array.isArray(teacher_ids)
          ? teacher_ids
          : [teacher_ids];

        const assignments = teachersArray.map((id) => ({
          course_id: courseId,
          employee_id: id,
        }));

        await CourseTeacher.knex().insert(assignments);
      }

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

  //--------------------------STUDENT---------------------------------

  // READ ALL (Ro'yxatni ko'rish) - /admin/students
  async getAllStudents(req, res, next) {
    try {
      const students = await Students.knex()
        .select('students.*', 'faculty.name as faculty_name')
        .leftJoin('faculty', 'students.faculty_id', '=', 'faculty.id');

      return res.render('admin/students/list.ejs', {
        students,
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  },

  //CREATE (Yaratish formasi) - /admin/students/create (GET)
  async createStudentPage(req, res, next) {
    try {
      const allCourses = await db('course').select(
        'id',
        'title',
        'credits',
        'faculty_id'
      );
      const faculties = await Faculties.getAll();
      return res.render('admin/students/create.ejs', {
        user: req.user,
        allCourses,
        faculties,
        errors: [],
        old: {},
      });
    } catch (err) {
      next(err);
    }
  },

  // CREATE (Talabani saqlash va Parol yuborish) - /admin/students (POST)
  async createStudent(req, res, next) {
    try {
      await db.transaction(async (trx) => {
        if (req.validationErrors && req.validationErrors.length > 0) {
          const allCourses = await db('course').select(
            'id',
            'title',
            'credits',
            'faculty_id'
          );
          const faculties = await Faculties.getAll();
          return res.render('admin/students/create.ejs', {
            errors: req.validationErrors,
            old: req.oldBody,
            user: req.user,
            allCourses,
            faculties,
          });
        }
        const {
          email,
          birth_date,
          enrollmentDate,
          faculty_id,
          courses,
          ...studentData
        } = req.body;

        const randomPassword = generatePassword();
        const hashedPassword = await hashPassword(randomPassword);

        const newStudentIds = await trx('students')
          .insert({
            ...studentData,
            email: email,
            password: hashedPassword,
            birth_date: birth_date,
            enrollmentDate: enrollmentDate,
            faculty_id: faculty_id || null,
          })
          .returning('id');

        const studentId = newStudentIds[0].id || newStudentIds[0];

        if (
          courses &&
          (Array.isArray(courses) || typeof courses === 'string')
        ) {
          const selectedCourses = Array.isArray(courses) ? courses : [courses];

          const courseBindings = selectedCourses.map((courseItem) => {
            let courseId = courseItem;

            if (typeof courseItem === 'string' && courseItem.startsWith('{')) {
              try {
                const parsed = JSON.parse(courseItem);
                courseId = parsed.id;
              } catch (e) {
                next(e);
              }
            }

            return {
              student_id: studentId,
              course_id: courseId,
            };
          });
          if (courseBindings.length > 0) {
            await trx('student_course').insert(courseBindings);
          }
        }
        await sendLoginCredentials(email, randomPassword);

        return res.redirect('/admin/students');
      });
    } catch (err) {
      next(err);
    }
  },
  async updateStudentPage(req, res, next) {
    try {
      const studentId = req.params.id;

      const student = await Students.knex()
        .where('students.id', studentId)
        .leftJoin('faculty', 'students.faculty_id', 'faculty.id')
        .select('students.*', 'faculty.name as faculty_name')
        .first();
      const studentCourses = await db('student_course')
        .where({ student_id: studentId })
        .pluck('course_id');

      const allCourses = await db('course').select(
        'id',
        'title',
        'credits',
        'faculty_id'
      );

      const faculties = await Faculties.getAll();

      if (!student) {
        return res.status(404).send('Talaba topilmadi.');
      }

      // Date formatini EJS'da to'g'ri ko'rsatish uchun "YYYY-MM-DD" ga o'tkazish
      const formatDate = (date) =>
        date ? new Date(date).toISOString().substring(0, 10) : null;

      student.birth_date = formatDate(student.birth_date);
      student.enrollmentDate = formatDate(student.enrollmentDate);

      return res.render('admin/students/edit.ejs', {
        student,
        allCourses,
        faculties,
        studentCourses,
        user: req.user,
        errors: req.validationErrors || [],
        old: {},
        success: null,
      });
    } catch (err) {
      next(err);
    }
  },

  // UPDATE (Ma'lumotni yangilash) - /admin/students/:id/edit (POST)
  async updateStudent(req, res, next) {
    try {
      await db.transaction(async (trx) => {
        const studentId = req.params.id;

        if (req.validationErrors && req.validationErrors.length > 0) {
          const allCourses = await trx('course').select(
            'id',
            'title',
            'credits',
            'faculty_id'
          );
          const faculties = await Faculties.getAll();
          const student = await Students.getById(studentId);

          const studentCourses = await trx('student_course')
            .where({ student_id: studentId })
            .pluck('course_id');

          const formatDate = (date) =>
            date ? new Date(date).toISOString().substring(0, 10) : null;
          if (student.birth_date)
            student.birth_date = formatDate(student.birth_date);
          if (student.enrollmentDate)
            student.enrollmentDate = formatDate(student.enrollmentDate);

          return res.render('admin/students/edit.ejs', {
            student,
            allCourses,
            faculties,
            studentCourses,
            errors: req.validationErrors,
            old: req.oldBody,
            user: req.user,
          });
        }
        // eslint-disable-next-line no-unused-vars
        const { faculty_id, courses, email, ...updateData } = req.body;

        await trx('students')
          .where({ id: studentId })
          .update({
            ...updateData,
            faculty_id: faculty_id || null,
          });

        await trx('student_course').where({ student_id: studentId }).del();

        if (
          courses &&
          (Array.isArray(courses) || typeof courses === 'string')
        ) {
          const selectedCourses = Array.isArray(courses) ? courses : [courses];

          const courseBindings = selectedCourses.map((courseId) => ({
            student_id: studentId,
            course_id: courseId,
          }));

          if (courseBindings.length > 0) {
            await trx('student_course').insert(courseBindings);
          }
        }
        return res.redirect('/admin/students');
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE (O'chirish) - /admin/students/:id/delete (POST)
  async deleteStudent(req, res, next) {
    try {
      await Students.delete(req.params.id);
      return res.redirect('/admin/students');
    } catch (err) {
      next(err);
    }
  },
};
