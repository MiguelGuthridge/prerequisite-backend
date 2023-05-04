import { UserId } from './user';

/** ID of a project */
export type ProjectId = string & { __hidden: 'ProjectId' };

/**
 * A project, essentially a named collection of tasks
 */
export type Project = {
  id: ProjectId
  name: string
  description: string
  owner: UserId
}
