import { Response, Router } from 'express';
import { getData } from '../data/data';
import HttpError from 'http-errors';
import { Project, ProjectId } from '../types/project';
import { v4 as uuid } from 'uuid';
import { getProjectById, isProjectVisibleToUser } from '../data/projects';
import { getUserIdFromRequest } from '../util/token';
import { body, validationResult } from 'express-validator';
import { Request } from 'express-jwt';
import { deleteTask, getTaskById } from '../data/tasks';
import { TaskId } from '../types/task';

const task = Router();

task.post(
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
      .trim(),
    body('complete')
      .exists()
      .isBoolean(),
    body('prerequisites')
      .isArray(),
    body('prerequisites.*')
      .isUUID(),
    body('project')
      .exists()
      .isUUID(),
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
      complete,
      prerequisites,
      project,
    }: {
      name: string,
      description: string,
      complete: boolean,
      prerequisites: TaskId[],
      project: ProjectId,
    } = req.body;

    // Validate project
    const projectData = getProjectById(project);

    if (projectData === null) {
      throw HttpError(400, 'Project does not exist');
    }

    if (projectData.owner !== owner) {
      throw HttpError(403, "You're not the owner of the project");
    }

    // Validate prerequisite tasks
    for (const prereqId of prerequisites) {
      const prereq = getTaskById(prereqId);
      if (prereq === null) {
        throw HttpError(400, `Task with ID ${prereqId} does not exist`);
      }
      if (prereq.project !== project) {
        throw HttpError(
          400,
          `Task with ID ${prereqId} does not belong to same project`
        );
      }
    }

    // Generate task ID
    const id = uuid() as TaskId;

    getData().tasks[id] = {
      id,
      name,
      description,
      complete,
      prerequisites,
      project,
    };

    res.json({ id });
  }
);

task.get('/:taskId', (req, res) => {
  const owner = getUserIdFromRequest(req);
  const taskId = req.params.taskId as TaskId;

  const task = getTaskById(taskId);

  if (task === null) {
    throw HttpError(400, 'Task does not exist');
  }

  const project = getProjectById(task.project) as Project;

  if (project.owner !== owner) {
    throw HttpError(403, "You're not the owner of the project");
  }

  if (!isProjectVisibleToUser(owner, task.project)) {
    throw HttpError(403, 'Unable to view project');
  }

  res.json(task);
});

// FIXME: Validate body
task.put('/:taskId', (req, res) => {
  const owner = getUserIdFromRequest(req);
  const taskId = req.params.taskId as TaskId;

  const task = getTaskById(taskId);

  if (task === null) {
    throw HttpError(400, 'Task does not exist');
  }

  const project = getProjectById(task.project) as Project;

  if (project.owner !== owner) {
    throw HttpError(403, "You're not the owner of the project");
  }

  if (!isProjectVisibleToUser(owner, task.project)) {
    throw HttpError(403, 'Unable to view project');
  }

  const {
    name,
    description,
    complete,
    prerequisites,
  } = req.body as {
    name: string,
    description: string,
    complete: boolean,
    prerequisites: TaskId[],
  };

  task.name = name;
  task.description = description;
  task.complete = complete;
  task.prerequisites = prerequisites;

  res.json({});
});

task.delete('/:taskId', (req, res) => {
  const owner = getUserIdFromRequest(req);
  const taskId = req.params.taskId as TaskId;

  const task = getTaskById(taskId);

  if (task === null) {
    throw HttpError(400, 'Task does not exist');
  }

  const project = getProjectById(task.project) as Project;

  if (project.owner !== owner) {
    throw HttpError(403, "You're not the owner of the project");
  }

  if (!isProjectVisibleToUser(owner, task.project)) {
    throw HttpError(403, 'Unable to view project');
  }

  deleteTask(taskId);

  res.json({});
});

export default task;