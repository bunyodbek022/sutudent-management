import { Router } from 'express';
import EmployeeRouter from './employee.route.js';
import adminRouter from './admin.route.js';
import teacherRouter from './teacher.route.js';
import studentRouter from './student.route.js';
const MainRouter = Router();

MainRouter.use('/employees', EmployeeRouter);
MainRouter.use('/admin', adminRouter);
MainRouter.use('/teacher', teacherRouter);
MainRouter.use('/student', studentRouter);
export default MainRouter;
