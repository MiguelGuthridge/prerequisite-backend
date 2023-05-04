import { Router } from 'express';
import { getData } from '../data/data';
import { getUserByUsername } from '../data/users';
import HttpError from 'http-errors';
import { UserId } from '../types/user';

const auth = Router();

auth.post('/register', (req, res) => {
  const {
    username,
    displayName,
    password,
  }: { username: string, displayName: string, password: string } = req.body;

  if (getUserByUsername(username)) {
    throw HttpError(400, 'Username already exists');
  }

  // Generate user ID
  const id = '1' as UserId; // FIXME

  getData().users[id] = {
    id,
    username,
    displayName,
    password,
  };

  res.json({ id });
});

auth.get('/login', (req, res) => {
  const { username, password }: { username: string, password: string } = req.body;

  const u = getUserByUsername(username);
  if (u === null) {
    throw HttpError(400, 'Username does not exist');
  }

  if (u.password !== password) {
    throw HttpError(400, 'Password is incorrect');
  }

  res.json({ id: u.id });
});

export default auth;
