import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.use(express.json());
app.use(morgan('tiny'));

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
