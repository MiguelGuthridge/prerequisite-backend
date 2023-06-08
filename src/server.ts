import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { expressjwt as jwt } from 'express-jwt';
import errorHandler from 'middleware-http-errors';
import debug from './routes/debug';
import auth from './routes/auth';
import projects from './routes/projects';
import { getAccessTokenSecret, isTokenRevoked } from './util/token';

dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));

app.use(
  jwt({
    secret: getAccessTokenSecret,
    algorithms: ['HS256'],
    isRevoked: isTokenRevoked,
    // TODO: Specify issuer and audience?
  }).unless({
    path: [
      '/',
      /\/debug\/*/,
      '/auth/register',
      '/auth/login',
    ],
  })
);

app.get('/', (req, res) => {
  res.send('Prerequisite backend is up and running!');
});

// TODO: Use environment variable to enable debug routes
app.use('/debug', debug);

app.use('/auth', auth);
app.use('/projects', projects);

app.use(errorHandler());

export default app;
