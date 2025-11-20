import { Router } from 'express';
import { StudentController } from '../controller/students.controller.js';
import { authGuard, roleGuard } from '../middlewares/guard.middleware.js';

const router = Router();

// Kirish sahifasi
router.get('/login', StudentController.getLoginPage);
// Kirishni amalga oshirish
router.post('/login', StudentController.login);
// Tizimdan chiqish
router.get(
  '/logout',
  authGuard,
  roleGuard('student'),
  StudentController.logout
);

router.get(
  '/',
  authGuard,
  roleGuard('student'),
  StudentController.getDashboard
);
router.get(
  '/grades',
  authGuard,
  roleGuard('student'),
  StudentController.getGrades
);
router.get(
  '/change-password',
  authGuard,
  roleGuard('student'),
  StudentController.getChangePassword
);
router.post(
  '/change-password',
  authGuard,
  roleGuard('student'),
  StudentController.changePassword
);

export default router;
