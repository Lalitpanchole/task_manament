import { TaskPriority } from './task';

export interface Project {
  id: string;
  name: string;
  description?: string;
  priority: TaskPriority;
  leadId: string;
  dueDate: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Archived';
  taskCount?: number;
}
