import { Router } from 'express';
import { getData } from '../data/data';
import { getUserById } from '../data/users';
import HttpError from 'http-errors';
import { UserId } from '../types/user';
import { ProjectId } from '../types/project';
import { getVisibleProjects } from '../data/projects';

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

projects.get('/list', (req, res) => {
  const { id } = req.query as { id: UserId };
  res.json({ projects: getVisibleProjects(id) });
});

export default projects;
