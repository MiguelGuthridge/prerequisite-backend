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

export enum TaskDeletionStrategy {
  /**
   * Successor tasks to the task are also deleted
   */
  Cascade = 'cascade',

  /**
   * Successor tasks have their dependencies updated to require
   * the dependencies of the deleted task
   */
  Reroute = 'reroute',

  /**
   * Successor tasks have this task removed from their
   * dependencies
   */
  Trim = 'trim'
}
