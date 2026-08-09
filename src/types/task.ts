export type TaskStatus = 'To Do' | 'Doing' | 'Completed' | 'On Hold';

export type TaskPriority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  memberId?: string;
  dueDate?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  memberIds: string[];
  labels: string[];
  startDate?: string;
  dueDate?: string;
  subtasks: Subtask[];
  resources: Resource[];
  comments: TaskComment[];
  updates: TaskActivity[];
  projectId?: string;
  reporterId?: string;
}
