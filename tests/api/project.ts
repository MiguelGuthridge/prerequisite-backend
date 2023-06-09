import { Project, ProjectId } from '../../src/types/project';
import { Token } from '../../src/types/user';
import { apiFetch } from './fetch';

export const list = async (token: Token): Promise<{ projects: Project[] }> => {
  return apiFetch(
    'GET',
    '/project',
    token,
  ) as Promise<{ projects: Project[] }>;
};

export const create = async (
  token: Token,
  name: string,
  description: string,
): Promise<{ id: ProjectId }> => {
  return apiFetch(
    'POST',
    '/project',
    token,
    { name, description },
  ) as Promise<{ id: ProjectId }>;
};

export const details = async (
  token: Token,
  id: ProjectId,
): Promise<Project> => {
  return apiFetch(
    'GET',
    `/project/${id}`,
    token,
  ) as Promise<Project>;
};

export const edit = async (
  token: Token,
  id: ProjectId,
  name: string,
  description: string,
) => {
  return apiFetch(
    'PUT',
    `/project/${id}`,
    token,
    { name, description },
  );
};

export const remove = async (
  token: Token,
  id: ProjectId,
) => {
  return apiFetch(
    'DELETE',
    `/project/${id}`,
    token,
  );
};

export default {
  list,
  create,
  details,
  edit,
  remove,
};
