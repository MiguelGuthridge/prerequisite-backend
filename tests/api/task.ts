import { ProjectId } from '../../src/types/project';
import { Task, TaskId, TaskDeletionStrategy } from '../../src/types/task';
import { Token } from '../../src/types/user';
import { apiFetch } from './fetch';

export const create = async (
  token: Token,
  project: ProjectId,
  name: string,
  description: string,
  complete: boolean,
  prerequisites: TaskId[],
): Promise<{ id: TaskId }> => {
  return apiFetch(
    'POST',
    '/task',
    token,
    {
      project,
      name,
      description,
      complete,
      prerequisites,
    },
  ) as Promise<{ id: TaskId }>;
};

export const details = async (
  token: Token,
  id: TaskId,
): Promise<Task> => {
  return apiFetch(
    'GET',
    `/task/${id}`,
    token,
  ) as Promise<Task>;
};

export const edit = async (
  token: Token,
  id: TaskId,
  name: string,
  description: string,
  complete: boolean,
  prerequisites: TaskId[],
) => {
  return apiFetch(
    'PUT',
    `/task/${id}`,
    token,
    { name, description, complete, prerequisites },
  );
};

export const remove = async (
  token: Token,
  id: TaskId,
  strategy: TaskDeletionStrategy,
) => {
  return apiFetch(
    'DELETE',
    `/task/${id}`,
    token,
    { strategy },
  );
};

export default {
  create,
  details,
  edit,
  remove,
};
