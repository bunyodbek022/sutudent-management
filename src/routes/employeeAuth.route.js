import { Router } from 'express';
import { AUTHemployees } from '../controller/employees.controller.js';
import {
  deleteEmployeeSchema,
  updateEmployeeSchema,
  loginEmployeeScheme,
} from '../validations/employees.validation.js';
import { validate } from '../middlewares/validate.js';
import { authGuard, selfGuard } from '../middlewares/guard.middleware.js';

const router = Router();

// GET PROFILE
router.get('/profile', authGuard, AUTHemployees.profile);

// LOG OUT
router.post('/logout', authGuard, selfGuard, AUTHemployees.logout);

// // EMPLOYEE REGISTER
// router.post(
//   '/register',
//   validate(createEmployeeSchema),
//   roleGuard('admin'),
//   AUTHemployees.register
// );
// EMPLOYEE LOGIN
router.post('/login', validate(loginEmployeeScheme), AUTHemployees.login);
router.post(
  '/updateAccess',
  authGuard,
  selfGuard,
  validate(updateEmployeeSchema),
  AUTHemployees.updateAccess
);
//EMPLOYEE UPDATE
router.put(
  '/:id',
  authGuard,
  validate(updateEmployeeSchema),
  AUTHemployees.update
);

//EMPLOYEE PASSWORD UPDATE

// EMPLOYEE DELETE
router.delete(
  '/profile',
  authGuard,
  selfGuard,
  validate(deleteEmployeeSchema),
  AUTHemployees.deleteProfile
);

export { router as authEmployeeRouter };
