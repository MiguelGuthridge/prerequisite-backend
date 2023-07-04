import { Task, TaskId } from '../types/task';
import { getData } from './data';

export const getTaskById = (id: TaskId): Task | null => {
  const u = getData().tasks[id];
  return u === undefined ? null : u;
};

export const deleteTask = (id: TaskId) => {
  delete getData().tasks[id];
};

/**
 * Recursively expand a prerequisite to give a list of all prerequisite tasks
 * given this task is a prerequisite (includes original task ID)
 */
export const expandTaskPrerequisite = (id: TaskId): TaskId[] => {
  const prerequisites = [id];

  const task = getTaskById(id) as Task;

  for (const prereq of task.prerequisites) {
    prerequisites.push(prereq);
    prerequisites.push(...expandTaskPrerequisite(prereq));
  }

  return prerequisites;
};

/**
 * Returns tasks that are direct successors of the task with the given ID.
 *
 * A successor is a task that has this task as one of its prerequisites.
 */
export const findDirectSuccessorTasks = (id: TaskId): TaskId[] => {
  const successors = [];
  for (const task of Object.values(getData().tasks)) {
    if (task.prerequisites.includes(id)) {
      successors.push(task.id);
    }
  }
  return successors;
};
