import { Router } from 'express';
import EmployeeRouter from './employee.route.js';
import adminRouter from './admin.route.js';
const MainRouter = Router();

MainRouter.use('/employees', EmployeeRouter);
MainRouter.use('/admin', adminRouter);
export default MainRouter;
