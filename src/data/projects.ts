import { Project, ProjectId } from '../types/project';
import { UserId } from '../types/user';
import { getData } from './data';

export const getProjectById = (id: ProjectId): Project | null => {
  const p = getData().projects[id];
  return p === undefined ? null : p;
};

export const isProjectVisibleToUser = (userId: UserId, projectId: ProjectId): boolean => {
  return getData().projects[projectId].owner === userId;
};

export const getVisibleProjects = (id: UserId): Project[] => {
  const results = [];
  for (const project of Object.values(getData().projects)) {
    if (isProjectVisibleToUser(id, project.id)) {
      results.push(project);
    }
  }
  return results;
};
