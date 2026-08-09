'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, Member, Subtask, Resource } from '../types/task';
import { Project } from '../types/project';
import { TaskViewMode, FieldPreferences, ProjectFilterOptions } from '../types/theme';
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_MEMBERS } from '../lib/initialData';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  members: Member[];
  taskView: TaskViewMode;
  searchQuery: string;
  fieldPreferences: FieldPreferences;
  projectFilters: ProjectFilterOptions;
  selectedTaskId: string | null;
  
  // State setters & Actions
  setTaskView: (view: TaskViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFieldPreferences: (prefs: FieldPreferences | ((prev: FieldPreferences) => FieldPreferences)) => void;
  setProjectFilters: (filters: ProjectFilterOptions | ((prev: ProjectFilterOptions) => ProjectFilterOptions)) => void;
  setSelectedTaskId: (id: string | null) => void;

  // Task CRUD
  addTask: (taskData: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  setTaskPriority: (id: string, priority: TaskPriority) => void;
  setTaskDates: (id: string, startDate?: string, dueDate?: string) => void;

  // Task Sub-entities
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addComment: (taskId: string, content: string) => void;
  addResource: (taskId: string, title: string, url: string) => void;
  toggleMemberOnTask: (taskId: string, memberId: string) => void;
  toggleLabelOnTask: (taskId: string, label: string) => void;

  // Project CRUD
  addProject: (projectData: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const DEFAULT_FIELDS: FieldPreferences = {
  priority: true,
  members: true,
  dueDate: true,
  labels: true,
  status: true,
  reporter: true,
};

const TASKS_KEY = 'ablespace_tasks';
const PROJECTS_KEY = 'ablespace_projects';
const VIEW_KEY = 'ablespace_task_view';
const FIELDS_KEY = 'ablespace_field_preferences';
const FILTERS_KEY = 'ablespace_project_filters';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members] = useState<Member[]>(INITIAL_MEMBERS);
  const [taskView, setTaskViewState] = useState<TaskViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldPreferences, setFieldPreferencesState] = useState<FieldPreferences>(DEFAULT_FIELDS);
  const [projectFilters, setProjectFiltersState] = useState<ProjectFilterOptions>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setTasks(getStorageItem<Task[]>(TASKS_KEY, INITIAL_TASKS));
    setProjects(getStorageItem<Project[]>(PROJECTS_KEY, INITIAL_PROJECTS));
    setTaskViewState(getStorageItem<TaskViewMode>(VIEW_KEY, 'board'));
    setFieldPreferencesState(getStorageItem<FieldPreferences>(FIELDS_KEY, DEFAULT_FIELDS));
    setProjectFiltersState(getStorageItem<ProjectFilterOptions>(FILTERS_KEY, {}));
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    setStorageItem(TASKS_KEY, newTasks);
  };

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    setStorageItem(PROJECTS_KEY, newProjects);
  };

  const setTaskView = (view: TaskViewMode) => {
    setTaskViewState(view);
    setStorageItem(VIEW_KEY, view);
  };

  const setFieldPreferences = (prefs: FieldPreferences | ((prev: FieldPreferences) => FieldPreferences)) => {
    setFieldPreferencesState((prev) => {
      const next = typeof prefs === 'function' ? prefs(prev) : prefs;
      setStorageItem(FIELDS_KEY, next);
      return next;
    });
  };

  const setProjectFilters = (filters: ProjectFilterOptions | ((prev: ProjectFilterOptions) => ProjectFilterOptions)) => {
    setProjectFiltersState((prev) => {
      const next = typeof filters === 'function' ? filters(prev) : filters;
      setStorageItem(FILTERS_KEY, next);
      return next;
    });
  };

  // Task Actions
  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      memberIds: taskData.memberIds || ['m-1'],
      labels: taskData.labels || ['Deployment'],
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      subtasks: [],
      resources: [],
      comments: [],
      updates: [
        {
          id: 'up-' + Date.now(),
          authorName: 'You',
          text: 'created the task',
          createdAt: 'Just now',
        },
      ],
      projectId: taskData.projectId || 'proj-1',
      reporterId: 'm-1',
    };

    saveTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, ...updates };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const setTaskStatus = (id: string, status: TaskStatus) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const updateText = `changed status from ${t.status} to ${status}`;
        const newUpdate = {
          id: 'up-' + Date.now(),
          authorName: 'You',
          text: updateText,
          createdAt: 'Just now',
        };
        return { ...t, status, updates: [newUpdate, ...t.updates] };
      }
      return t;
    });
    saveTasks(updated);
  };

  const setTaskPriority = (id: string, priority: TaskPriority) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const updateText = `changed priority from ${t.priority} to ${priority}`;
        const newUpdate = {
          id: 'up-' + Date.now(),
          authorName: 'You',
          text: updateText,
          createdAt: 'Just now',
        };
        return { ...t, priority, updates: [newUpdate, ...t.updates] };
      }
      return t;
    });
    saveTasks(updated);
  };

  const setTaskDates = (id: string, startDate?: string, dueDate?: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const updateText = `updated due date to ${dueDate || startDate}`;
        const newUpdate = {
          id: 'up-' + Date.now(),
          authorName: 'You',
          text: updateText,
          createdAt: 'Just now',
        };
        return { ...t, startDate: startDate ?? t.startDate, dueDate: dueDate ?? t.dueDate, updates: [newUpdate, ...t.updates] };
      }
      return t;
    });
    saveTasks(updated);
  };

  const addSubtask = (taskId: string, title: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const newSubtask: Subtask = {
          id: 'sub-' + Date.now(),
          title,
          completed: false,
          priority: 'Medium',
          dueDate: new Date().toISOString().split('T')[0],
        };
        return { ...t, subtasks: [...t.subtasks, newSubtask] };
      }
      return t;
    });
    saveTasks(updated);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const updatedSubs = t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s));
        return { ...t, subtasks: updatedSubs };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) };
      }
      return t;
    });
    saveTasks(updated);
  };

  const addComment = (taskId: string, content: string) => {
    if (!content.trim()) return;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const newComment = {
          id: 'c-' + Date.now(),
          authorName: 'You',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          content,
          createdAt: 'Just now',
        };
        return { ...t, comments: [...t.comments, newComment] };
      }
      return t;
    });
    saveTasks(updated);
  };

  const addResource = (taskId: string, title: string, url: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const newRes: Resource = {
          id: 'res-' + Date.now(),
          title: title || url,
          url: url.startsWith('http') ? url : `https://${url}`,
        };
        return { ...t, resources: [...t.resources, newRes] };
      }
      return t;
    });
    saveTasks(updated);
  };

  const toggleMemberOnTask = (taskId: string, memberId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const hasMember = t.memberIds.includes(memberId);
        const newMembers = hasMember ? t.memberIds.filter((m) => m !== memberId) : [...t.memberIds, memberId];
        return { ...t, memberIds: newMembers };
      }
      return t;
    });
    saveTasks(updated);
  };

  const toggleLabelOnTask = (taskId: string, label: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const hasLabel = t.labels.includes(label);
        const newLabels = hasLabel ? t.labels.filter((l) => l !== label) : [...t.labels, label];
        return { ...t, labels: newLabels };
      }
      return t;
    });
    saveTasks(updated);
  };

  // Project Actions
  const addProject = (projectData: Partial<Project>) => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      priority: projectData.priority || 'Medium',
      leadId: projectData.leadId || 'm-1',
      dueDate: projectData.dueDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      taskCount: 0,
    };
    saveProjects([...projects, newProj]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProjects(updated);
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        members,
        taskView,
        searchQuery,
        fieldPreferences,
        projectFilters,
        selectedTaskId,
        setTaskView,
        setSearchQuery,
        setFieldPreferences,
        setProjectFilters,
        setSelectedTaskId,
        addTask,
        updateTask,
        deleteTask,
        setTaskStatus,
        setTaskPriority,
        setTaskDates,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addComment,
        addResource,
        toggleMemberOnTask,
        toggleLabelOnTask,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
