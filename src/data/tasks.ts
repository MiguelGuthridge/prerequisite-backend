import { ProjectId } from '../types/project';
import { Task, TaskId } from '../types/task';
import { getData } from './data';

export const getTaskById = (id: TaskId): Task | null => {
  const u = getData().tasks[id];
  return u === undefined ? null : u;
};

export const deleteTask = (id: TaskId) => {
  delete getData().tasks[id];
};

export const getTasksInProject = (id: ProjectId): Task[] => {
  const tasks = [];
  for (const task of Object.values(getData().tasks)) {
    if (task.project === id) {
      tasks.push(task);
    }
  }
  return tasks;
};

/**
 * Recursively expand a prerequisite to give a list of all prerequisite tasks
 * given this task is a prerequisite (does not include original task ID)
 */
export const expandTaskPrerequisite = (id: TaskId): TaskId[] => {
  const prerequisites = [];

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

export const findAllSuccessorTasks = (id: TaskId): TaskId[] => {
  const successors: TaskId[] = [];
  for (const task of Object.values(getData().tasks)) {
    // This is super inefficient - may need to design a better algorithm for
    // this in future
    const prereqs = expandTaskPrerequisite(task.id);
    if (prereqs.includes(id)) {
      // Only include it if it isn't there already
      if (!successors.includes(task.id)) {
        successors.push(task.id);
      }
    }
  }

  return successors;
};

/**
 * Add a task as a prereq to another
 * @param task task
 * @param prereq prerequisite task
 * @returns whether the task was added, or was already a prereq
 */
export const taskAddPrerequisite = (task: Task, prereq: TaskId): boolean => {
  if (task.prerequisites.includes(prereq)) {
    return false;
  } else {
    task.prerequisites.push(prereq);
    return true;
  }
};

export const taskRemovePrerequisite = (task: Task, prereq: TaskId): boolean => {
  if (task.prerequisites.includes(prereq)) {
    task.prerequisites = task.prerequisites.filter(p => p !== prereq);
    return true;
  } else {
    return false;
  }
};
