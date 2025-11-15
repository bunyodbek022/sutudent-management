import { Router } from 'express';
import { AUTHemployees } from '../controller/employees.controller.js';
import {
  createEmployeeSchema,
  deleteEmployeeSchema,
  verifyEmployeeValidation,
  updateEmployeeSchema,
  loginEmployeeScheme,
} from '../validations/employees.validation.js';
import { validate } from '../middlewares/validate.js';
import { authGuard } from '../middlewares/guard.middleware.js';
const router = Router();

router.get('/profile', authGuard, AUTHemployees.profile);
router.post(
  '/verify',
  validate(verifyEmployeeValidation),
  AUTHemployees.verifyUser
);
router.post('/logout', authGuard, AUTHemployees.logout);
router.post(
  '/register',
  validate(createEmployeeSchema),
  AUTHemployees.register
);
router.post('/login', validate(loginEmployeeScheme), AUTHemployees.login);
router.post(
  '/updateAccess',
  authGuard,
  validate(updateEmployeeSchema),
  AUTHemployees.updateAccess
);
router.delete(
  '/profile',
  authGuard,
  validate(deleteEmployeeSchema),
  AUTHemployees.deleteProfile
);

export { router as authEmployeeRouter };
