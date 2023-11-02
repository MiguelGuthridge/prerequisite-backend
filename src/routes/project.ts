import { Response, Router } from 'express';
import { getData, saveData } from '../data/data';
import HttpError from 'http-errors';
import { ProjectId } from '../types/project';
import { v4 as uuid } from 'uuid';
import { deleteProject, getProjectById, getVisibleProjects, isProjectVisibleToUser } from '../data/projects';
import { getUserIdFromRequest } from '../util/token';
import { body, validationResult } from 'express-validator';
import { Request } from 'express-jwt';
import { deleteTask, getTasksInProject } from '../data/tasks';

const project = Router();

project.post(
  '/',
  [
    body('name')
      .exists()
      .escape()
      .trim()
      .notEmpty(),
    body('description')
      .exists()
      .escape()
      .trim()
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const owner = getUserIdFromRequest(req);

    const {
      name,
      description,
    }: { name: string, description: string } = req.body;

    // Generate project ID
    const id = uuid() as ProjectId;

    getData().projects[id] = {
      id,
      name,
      description,
      owner,
    };

    saveData();

    res.json({ id });
  }
);

project.get('/', (req, res) => {
  const id = getUserIdFromRequest(req);
  res.json({ projects: getVisibleProjects(id) });
});

project.get('/:projectId', (req, res) => {
  const id = getUserIdFromRequest(req);
  const projectId = req.params.projectId as ProjectId;

  const project = getProjectById(projectId);

  if (project === null) {
    throw HttpError(400, 'Project does not exist');
  }

  if (!isProjectVisibleToUser(id, projectId)) {
    throw HttpError(403, 'Unable to view project');
  }

  res.json({
    ...project,
    tasks: getTasksInProject(projectId),
  });
});

project.put(
  '/:projectId',
  [
    body('name')
      .exists()
      .escape()
      .trim()
      .notEmpty(),
    body('description')
      .exists()
      .escape()
      .trim()
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const id = getUserIdFromRequest(req);
    const projectId = req.params.projectId as ProjectId;

    const project = getProjectById(projectId);

    if (project === null) {
      throw HttpError(400, 'Project does not exist');
    }

    if (project.owner !== id) {
      throw HttpError(403, "You're not the owner of the project");
    }

    const { name, description } = req.body as { name: string, description: string };

    project.name = name;
    project.description = description;

    saveData();

    res.json({});
  }
);

project.delete('/:projectId', (req, res) => {
  const id = getUserIdFromRequest(req);
  const projectId = req.params.projectId as ProjectId;

  const project = getProjectById(projectId);

  if (project === null) {
    throw HttpError(400, 'Project does not exist');
  }

  if (project.owner !== id) {
    throw HttpError(403, "You're not the owner of the project");
  }

  // Delete all tasks associated with the project
  for (const task of getTasksInProject(projectId)) {
    deleteTask(task.id);
  }

  deleteProject(projectId);

  saveData();

  res.json({});
});

export default project;
