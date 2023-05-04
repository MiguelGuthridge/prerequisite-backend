import { Project, ProjectId } from '../types/project';
import { getData } from './data';

export const getProjectById = (id: ProjectId): Project | null => {
  const p = getData().projects[id];
  return p === undefined ? null : p;
};
