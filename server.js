import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import errorHandler from './src/middlewares/errorHandler.js';
import { authEmployeeRouter } from './src/routes/employeeAuth.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use('/', authEmployeeRouter);

app.use(errorHandler);

const bootstrap = async () => {
  try {
    // eslint-disable-next-line no-undef
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
