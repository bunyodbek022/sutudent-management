import { Router } from 'express';
import { AdminController } from '../controller/admin.controller.js';
import { authGuard, roleGuard } from '../middlewares/guard.middleware.js';
import { validate } from '../middlewares/validate.js';
import { FacultyValidation } from '../validations/faculty.validation.js';
import { CourseValidation } from '../validations/course.validation.js';
import { StudentValidation } from '../validations/students.validation.js';
const router = Router();
router.use(authGuard, roleGuard('admin'));

// Dashboard manzili: /admin/dashboard
router.get('/dashboard', AdminController.getDashboard);
router.get('/faculties', AdminController.getAllFaculties);

// 2. Yaratish formasi
router.get('/faculties/create', AdminController.createFacultyPage);
router.post(
  '/faculties',
  validate(FacultyValidation.createFacultySchema),
  AdminController.createFaculty
);

// 3. Tahrirlash formasi
router.get('/faculties/:id/edit', AdminController.updateFacultyPage);
router.post(
  '/faculties/:id/edit',
  validate(FacultyValidation.updateFacultySchema),
  AdminController.updateFaculty
);

// 4. O'chirish
router.post('/faculties/:id/delete', AdminController.deleteFaculty);

// -------------------COURSE------------------//

// 1. Kurslar ro'yxati
router.get('/courses', AdminController.getAllCourses);

// 2. Yaratish formasi
router.get('/courses/create', AdminController.createCoursePage);
router.post(
  '/courses',
  validate(CourseValidation.createCourseSchema),
  AdminController.createCourse
);

// 3. Tahrirlash formasi
router.get('/courses/:id/edit', AdminController.updateCoursePage);
router.post(
  '/courses/:id/edit',
  validate(CourseValidation.updateCourseSchema),
  AdminController.updateCourse
);

// 4. O'chirish
router.post('/courses/:id/delete', AdminController.deleteCourse);

//----------------------STUDENT-----------------------------------

router.get('/students', AdminController.getAllStudents);
router.get('/students/create', AdminController.createStudentPage);
router.post(
  '/students',
  validate(StudentValidation.createStudentSchema),
  AdminController.createStudent
);
router.get('/students/:id/edit', AdminController.updateStudentPage);
router.post(
  '/students/:id/edit',
  validate(StudentValidation.updateStudentSchema),
  AdminController.updateStudent
);

//O'chirish
router.post('/students/:id/delete', AdminController.deleteStudent);

export default router;
