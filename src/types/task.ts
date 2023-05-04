
export type TaskId = string & { __hidden: 'TaskId' };

export type Task = {
  id: TaskId
  name: string
  description: string
  complete: boolean
  prerequisites: TaskId
}
