import { Project, ProjectId } from './project';
import { Task, TaskId } from './task';
import { User, UserId } from './user';

export type DataStore = {
  users: Record<UserId, User>
  projects: Record<ProjectId, Project>
  tasks: Record<TaskId, Task>
}
