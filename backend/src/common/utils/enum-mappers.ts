import { TaskStatus, TaskPriority, ProjectStatus } from '@prisma/client';

export function toPrismaTaskStatus(status?: string): TaskStatus {
  if (!status) return TaskStatus.TODO;
  const s = status.trim().toUpperCase().replace(/\s+/g, '_');
  if (s === 'TO_DO' || s === 'TODO') return TaskStatus.TODO;
  if (s === 'DOING') return TaskStatus.DOING;
  if (s === 'COMPLETED') return TaskStatus.COMPLETED;
  if (s === 'ON_HOLD' || s === 'ONHOLD') return TaskStatus.ON_HOLD;
  return TaskStatus.TODO;
}

export function fromPrismaTaskStatus(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.DOING:
      return 'Doing';
    case TaskStatus.COMPLETED:
      return 'Completed';
    case TaskStatus.ON_HOLD:
      return 'On Hold';
    default:
      return 'To Do';
  }
}

export function toPrismaTaskPriority(priority?: string): TaskPriority {
  if (!priority) return TaskPriority.MEDIUM;
  const p = priority.trim().toUpperCase().replace(/\s+/g, '_');
  if (p === 'NO_PRIORITY' || p === 'NOPRIORITY') return TaskPriority.NO_PRIORITY;
  if (p === 'URGENT') return TaskPriority.URGENT;
  if (p === 'HIGH') return TaskPriority.HIGH;
  if (p === 'MEDIUM') return TaskPriority.MEDIUM;
  if (p === 'LOW') return TaskPriority.LOW;
  return TaskPriority.MEDIUM;
}

export function fromPrismaTaskPriority(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.NO_PRIORITY:
      return 'No Priority';
    case TaskPriority.URGENT:
      return 'Urgent';
    case TaskPriority.HIGH:
      return 'High';
    case TaskPriority.MEDIUM:
      return 'Medium';
    case TaskPriority.LOW:
      return 'Low';
    default:
      return 'Medium';
  }
}

export function toPrismaProjectStatus(status?: string): ProjectStatus {
  if (!status) return ProjectStatus.Active;
  const s = status.trim().toUpperCase().replace(/\s+/g, '_');
  if (s === 'ACTIVE') return ProjectStatus.Active;
  if (s === 'COMPLETED') return ProjectStatus.Completed;
  if (s === 'ON_HOLD' || s === 'ONHOLD') return ProjectStatus.On_Hold;
  if (s === 'ARCHIVED') return ProjectStatus.Archived;
  return ProjectStatus.Active;
}

export function fromPrismaProjectStatus(status: ProjectStatus): string {
  switch (status) {
    case ProjectStatus.Active:
      return 'Active';
    case ProjectStatus.Completed:
      return 'Completed';
    case ProjectStatus.On_Hold:
      return 'On Hold';
    case ProjectStatus.Archived:
      return 'Archived';
    default:
      return 'Active';
  }
}
