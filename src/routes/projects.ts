import { Router } from 'express';
import { getData } from '../data/data';
import { getUserById } from '../data/users';
import HttpError from 'http-errors';
import { UserId } from '../types/user';
import { ProjectId } from '../types/project';
import { v4 as uuid } from 'uuid';
import { getProjectById, getVisibleProjects, isProjectVisibleToUser } from '../data/projects';
import { getUserIdFromRequest as userFromToken } from '../util/token';

const projects = Router();

projects.post('/', (req, res) => {
  const {
    name,
    description,
    id: owner,
  }: { name: string, description: string, id: UserId } = req.body;

  if (!getUserById(owner)) {
    throw HttpError(400, 'Bad user id');
  }

  // Generate project ID
  const id = uuid() as ProjectId;

  getData().projects[id] = {
    id,
    name,
    description,
    owner,
  };

  res.json({ id });
});

projects.get('/', (req, res) => {
  const id = userFromToken(req);
  res.json({ projects: getVisibleProjects(id) });
});

projects.get('/:projectId', (req, res) => {
  const id = userFromToken(req);
  const projectId = req.params.projectId as ProjectId;

  const project = getProjectById(projectId);

  if (project === null) {
    throw HttpError(400, 'Project does not exist');
  }

  if (!isProjectVisibleToUser(id, projectId)) {
    throw HttpError(403, 'Unable to view project');
  }

  res.json(project);
});

export default projects;
