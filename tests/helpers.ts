import { ProjectId } from '../src/types/project';
import { TaskId } from '../src/types/task';
import { Token } from '../src/types/user';
import api from './api';

export const makeUser = async (num?: number | undefined) => {
  if (num === undefined) {
    num = 1;
  }
  return api.auth.register(`user${num}`, `User ${num}`, 'abc123ABC!');
};

export const makeProject = async (token: Token, num?: number | undefined) => {
  if (num === undefined) {
    num = 1;
  }
  return api.project.create(
    token,
    `Project ${num}`,
    `This is project number ${num}`
  );
};

type MakeTaskOptions = {
  num?: number | undefined
  prerequisites?: TaskId[] | undefined
}

export const makeTask = async (
  token: Token,
  project: ProjectId,
  options?: MakeTaskOptions | undefined,
) => {
  if (options === undefined) {
    options = {};
  }
  let { num, prerequisites } = options;
  if (num === undefined) {
    num = 1;
  }
  if (prerequisites === undefined) {
    prerequisites = [];
  }
  return api.task.create(
    token,
    project,
    `Task ${num}`,
    `This is task number ${num}`,
    false,
    prerequisites,
  );
};
