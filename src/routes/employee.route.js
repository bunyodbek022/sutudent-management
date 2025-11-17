import Router from 'express';
import { EmployeeController } from '../controller/employees.controller.js';
// import { roleGuard } from '../middlewares/authGuard.js';
import { validate } from '../middlewares/validate.js';
import {
  createEmployeeSchema,
  loginEmployeeScheme,
  updateEmployeeSchema,
  updatePasswordScheme,
} from '../validations/employees.validation.js';
import { authGuard, roleGuard } from '../middlewares/guard.middleware.js';

const EmployeeRouter = Router();

// Render pages
EmployeeRouter.get(
  '/register',
  authGuard,
  roleGuard('admin'),
  EmployeeController.registerPage
);
EmployeeRouter.get('/login', EmployeeController.loginPage);
EmployeeRouter.get('/profile/edit', authGuard, EmployeeController.updatePage);
EmployeeRouter.get(
  '/:employeeId/edit',
  authGuard,
  roleGuard('admin'),
  EmployeeController.updatePage
);
EmployeeRouter.get('/profile', authGuard, EmployeeController.profile);
EmployeeRouter.get(
  '/update-password',
  authGuard,
  EmployeeController.updatePasswordPage
);
EmployeeRouter.get(
  '/',
  authGuard,
  roleGuard('admin'),
  EmployeeController.getAll
);

// API POST
EmployeeRouter.post(
  '/register',
  authGuard,
  roleGuard('admin'),
  validate(createEmployeeSchema),
  EmployeeController.register.bind(EmployeeController)
);
EmployeeRouter.post(
  '/login',
  validate(loginEmployeeScheme),
  EmployeeController.login.bind(EmployeeController)
);
EmployeeRouter.post('/logout', authGuard, EmployeeController.logout);
EmployeeRouter.post(
  '/profile/edit',
  authGuard,
  roleGuard('admin'),
  validate(updateEmployeeSchema),
  EmployeeController.update
);
EmployeeRouter.post(
  '/:employeeId/edit',
  authGuard,
  roleGuard('admin'),
  validate(updateEmployeeSchema),
  EmployeeController.update
);
EmployeeRouter.post(
  '/update-password',
  authGuard,
  validate(updatePasswordScheme),
  EmployeeController.updatePassword
);
EmployeeRouter.post(
  '/:employeeId/delete',
  authGuard,
  roleGuard('admin'),
  EmployeeController.delete
);
export default EmployeeRouter;
