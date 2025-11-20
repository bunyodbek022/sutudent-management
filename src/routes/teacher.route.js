import { Router } from 'express';
import { TeacherController } from '../controller/teacher.controller.js';
import { EmployeeController } from '../controller/employees.controller.js';
import { authGuard, roleGuard } from '../middlewares/guard.middleware.js';

const router = Router();

router.use(authGuard, roleGuard('teacher'));

router.get('/', TeacherController.getDashboard);
router.get('/logout', EmployeeController.logout);
router.get('/courses/:courseId/grade', TeacherController.getCourseStudents);

router.post('/courses/:courseId/grade', TeacherController.submitGrade);
export default router;
