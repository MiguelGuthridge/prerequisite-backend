import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();
const port = parseInt(process.env.PORT as string);
const ip = process.env.IP as string;

const app = express();
app.use(cors());
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('Prerequisite backend is up and running!');
});

app.listen(
  port,
  ip,
  () => console.log(`Prerequisite backend running on http://${ip}:${port}/`)
);
