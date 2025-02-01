export enum LovType {
  TASK_TYPE = 'TASK_TYPE',
  TASK_PRIORITY = 'TASK_PRIORITY',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  URGENT = 'URGENT',
}

export enum TaskType {
  TASK = 'TASK',
  BUG ='BUG',
  STORY = 'STORY',
}

export function isTaskType(value: string): value is TaskType {
  return Object.values(TaskType).includes(value as TaskType);
}

export function isTaskPriority(value: string): value is TaskPriority {
  return Object.values(TaskPriority).includes(value as TaskPriority);
}

export function toTaskType(value: string): TaskType {
  if (!isTaskType(value)) {
    throw new Error(`Invalid TaskType value: ${value}`);
  }
  return value;
}

export function toTaskPriority(value: string): TaskPriority {
  if (!isTaskPriority(value)) {
    throw new Error(`Invalid TaskPriority value: ${value}`);
  }
  return value;
}