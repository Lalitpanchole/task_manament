export type ThemeMode = 'light' | 'dark';

export type ColorAccentMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export type TaskViewMode = 'board' | 'list';

export interface FieldPreferences {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

export interface ProjectFilterOptions {
  status?: string;
  priority?: string;
  memberId?: string;
  dueDate?: string;
  team?: string;
  label?: string;
  reporterId?: string;
}
