import { Task, TaskId } from '../types/task';
import { getData } from './data';

export const getTaskById = (id: TaskId): Task | null => {
  const u = getData().tasks[id];
  return u === undefined ? null : u;
};

export const deleteTask = (id: TaskId) => {
  delete getData().tasks[id];
};

export const expandTaskPrerequisite = (id: TaskId): TaskId[] => {
  const prerequisites = [id];

  const task = getTaskById(id) as Task;

  for (const prereq of task.prerequisites) {
    prerequisites.push(prereq);
    prerequisites.push(...expandTaskPrerequisite(prereq));
  }

  return prerequisites;
};
