import { Router } from 'express';
import { getData } from '../data/data';
import { getUserById } from '../data/users';
import HttpError from 'http-errors';
import { UserId } from '../types/user';
import { ProjectId } from '../types/project';

const projects = Router();

projects.post('/create', (req, res) => {
  const {
    name,
    description,
    id: owner,
  }: { name: string, description: string, id: UserId } = req.body;

  if (!getUserById(owner)) {
    throw HttpError(400, 'Bad user id');
  }

  // Generate project ID
  const id = '1' as ProjectId; // FIXME

  getData().projects[id] = {
    id,
    name,
    description,
    owner,
  };

  res.json({ id });
});

export default projects;
