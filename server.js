import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import errorHandler from './src/middlewares/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import MainRouter from './src/routes/index.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Logger
app.use(morgan('tiny'));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- Routers --- //
app.use('/', MainRouter);

// --- Error handler --- //
app.use(errorHandler);

const bootstrap = async () => {
  try {
    // eslint-disable-next-line no-undef
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

bootstrap();
