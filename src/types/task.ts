import { ProjectId } from './project';

export type TaskId = string & { __hidden: 'TaskId' };

export type Task = {
  id: TaskId
  name: string
  description: string
  complete: boolean
  prerequisites: TaskId[]
  project: ProjectId
}

export enum TaskDeletetionStrategy {
  /**
   * Tasks that depend on this task are also deleted
   */
  Cascade = 'cascade',

  /**
   * Tasks that depend on this task have their dependencies updated to require
   * the dependencies of the deleted task
   */
  Reroute = 'reroute',

  /**
   * Tasks that depend on this task have this task removed from their
   * dependencies
   */
  Trim = 'trim'
}
