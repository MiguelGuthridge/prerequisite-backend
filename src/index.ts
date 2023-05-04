import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import errorHandler from 'middleware-http-errors';
import debug from './routes/debug';
import auth from './routes/auth';

dotenv.config();
const port = parseInt(process.env.PORT as string);
const ip = process.env.IP as string;

const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Prerequisite backend is up and running!');
});

app.use('/debug', debug);
app.use('/auth', auth);

app.use(errorHandler());

app.listen(
  port,
  ip,
  () => console.log(`Prerequisite backend running on http://${ip}:${port}/`)
);
