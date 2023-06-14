import { Task, TaskId } from '../types/task';
import { getData } from './data';

export const getTaskById = (id: TaskId): Task | null => {
  const u = getData().tasks[id];
  return u === undefined ? null : u;
};

export const deleteTask = (id: TaskId) => {
  delete getData().tasks[id];
};
