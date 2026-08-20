'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, Member, Subtask, TaskComment } from '../types/task';
import { Project } from '../types/project';
import { TaskViewMode, FieldPreferences, ProjectFilterOptions } from '../types/theme';
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_MEMBERS } from '../lib/initialData';
import { getStorageItem, setStorageItem } from '../lib/storage';
import { tasksApi, projectsApi, usersApi, subtasksApi, commentsApi, getAuthToken } from '../lib/api';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  members: Member[];
  taskView: TaskViewMode;
  searchQuery: string;
  fieldPreferences: FieldPreferences;
  projectFilters: ProjectFilterOptions;
  selectedTaskId: string | null;
  isLoading: boolean;
  
  // State setters & Actions
  setTaskView: (view: TaskViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFieldPreferences: (prefs: FieldPreferences | ((prev: FieldPreferences) => FieldPreferences)) => void;
  setProjectFilters: (filters: ProjectFilterOptions | ((prev: ProjectFilterOptions) => ProjectFilterOptions)) => void;
  setSelectedTaskId: (id: string | null) => void;
  refreshData: () => Promise<void>;

  // Task CRUD
  addTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  setTaskPriority: (id: string, priority: TaskPriority) => Promise<void>;
  setTaskDates: (id: string, startDate?: string, dueDate?: string) => Promise<void>;

  // Task Sub-entities
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  addComment: (taskId: string, content: string) => Promise<void>;
  addResource: (taskId: string, title: string, url: string) => Promise<void>;
  toggleMemberOnTask: (taskId: string, memberId: string) => Promise<void>;
  toggleLabelOnTask: (taskId: string, label: string) => Promise<void>;

  // Project CRUD
  addProject: (projectData: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const DEFAULT_FIELDS: FieldPreferences = {
  priority: true,
  members: true,
  dueDate: true,
  labels: true,
  status: true,
  reporter: true,
};

const VIEW_KEY = 'ablespace_task_view';
const FIELDS_KEY = 'ablespace_field_preferences';
const FILTERS_KEY = 'ablespace_project_filters';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [taskView, setTaskViewState] = useState<TaskViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [fieldPreferences, setFieldPreferencesState] = useState<FieldPreferences>(DEFAULT_FIELDS);
  const [projectFilters, setProjectFiltersState] = useState<ProjectFilterOptions>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load backend data
  const refreshData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const [fetchedTasks, fetchedProjects, fetchedUsers] = await Promise.all([
        tasksApi.getTasks(),
        projectsApi.getProjects(),
        usersApi.getUsers(),
      ]);

      if (Array.isArray(fetchedTasks)) setTasks(fetchedTasks);
      if (Array.isArray(fetchedProjects)) setProjects(fetchedProjects);
      if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) setMembers(fetchedUsers);
    } catch (error) {
      console.warn('Backend API connection warning (using local dataset fallback):', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setTaskViewState(getStorageItem<TaskViewMode>(VIEW_KEY, 'board'));
    setFieldPreferencesState(getStorageItem<FieldPreferences>(FIELDS_KEY, DEFAULT_FIELDS));
    setProjectFiltersState(getStorageItem<ProjectFilterOptions>(FILTERS_KEY, {}));

    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, refreshData]);

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
  const addTask = async (taskData: Partial<Task>) => {
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'To Do',
      priority: taskData.priority || 'Medium',
      startDate: taskData.startDate || new Date().toISOString(),
      dueDate: taskData.dueDate || new Date().toISOString(),
      projectId: taskData.projectId || 'proj-1',
      reporterId: 'user-1',
      memberIds: taskData.memberIds || ['user-1'],
      labels: taskData.labels || ['Design'],
      subtasks: [],
      comments: [],
      resources: [],
      updates: [],
    };

    try {
      const createdTask = await tasksApi.createTask(taskData);
      setTasks((prev) => [createdTask || newTask, ...prev]);
    } catch (e) {
      console.warn('Failed to create task via API (using local state fallback):', e);
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      await tasksApi.updateTask(id, updates);
    } catch (e) {
      console.warn(`Backend offline - updated task ${id} in local state:`, e);
    }
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
    try {
      await tasksApi.deleteTask(id);
    } catch (e) {
      console.warn(`Backend offline - deleted task ${id} in local state:`, e);
    }
  };

  const setTaskStatus = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  };

  const setTaskPriority = async (id: string, priority: TaskPriority) => {
    await updateTask(id, { priority });
  };

  const setTaskDates = async (id: string, startDate?: string, dueDate?: string) => {
    await updateTask(id, { startDate, dueDate });
  };

  const addSubtask = async (taskId: string, title: string) => {
    const newSubtask: Subtask = {
      id: 'sub-' + Date.now(),
      title,
      completed: false,
      priority: 'Medium',
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSubtask] } : t)),
    );
    try {
      await subtasksApi.createSubtask(taskId, title);
    } catch (e) {
      console.warn('Backend offline - added subtask in local state:', e);
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s)),
        };
      }),
    );
    const task = tasks.find((t) => t.id === taskId);
    const subtask = task?.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      try {
        await subtasksApi.updateSubtask(subtaskId, { completed: !subtask.completed });
      } catch (e) {
        console.warn('Backend offline - toggled subtask in local state:', e);
      }
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
        };
      }),
    );
    try {
      await subtasksApi.deleteSubtask(subtaskId);
    } catch (e) {
      console.warn('Backend offline - deleted subtask in local state:', e);
    }
  };

  const addComment = async (taskId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: TaskComment = {
      id: 'comment-' + Date.now(),
      authorName: 'Dexter',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content,
      createdAt: 'Just now',
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t)),
    );
    try {
      await commentsApi.addComment(taskId, content);
    } catch (e) {
      console.warn('Backend offline - added comment in local state:', e);
    }
  };

  const addResource = async (taskId: string, title: string, url: string) => {
    const newResource = {
      id: 'res-' + Date.now(),
      title,
      url,
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, resources: [...t.resources, newResource] } : t)),
    );
    try {
      await tasksApi.addResource(taskId, title, url);
    } catch (e) {
      console.warn('Backend offline - added resource in local state:', e);
    }
  };

  const toggleMemberOnTask = async (taskId: string, memberId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const exists = t.memberIds.includes(memberId);
        return {
          ...t,
          memberIds: exists ? t.memberIds.filter((m) => m !== memberId) : [...t.memberIds, memberId],
        };
      }),
    );
    try {
      await tasksApi.toggleMember(taskId, memberId);
    } catch (e) {
      console.warn('Backend offline - toggled member in local state:', e);
    }
  };

  const toggleLabelOnTask = async (taskId: string, label: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const exists = t.labels.includes(label);
        return {
          ...t,
          labels: exists ? t.labels.filter((l) => l !== label) : [...t.labels, label],
        };
      }),
    );
    try {
      await tasksApi.toggleLabel(taskId, label);
    } catch (e) {
      console.warn('Backend offline - toggled label in local state:', e);
    }
  };

  // Project Actions
  const addProject = async (projectData: Partial<Project>) => {
    const newProj: Project = {
      id: 'proj-' + Date.now(),
      name: projectData.name || 'New Project',
      description: projectData.description || '',
      priority: projectData.priority || 'Medium',
      leadId: projectData.leadId || 'user-1',
      dueDate: projectData.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: (projectData.status as any) || 'Active',
      taskCount: 0,
    };
    setProjects((prev) => [...prev, newProj]);

    try {
      const serverProj = await projectsApi.createProject(projectData);
      if (serverProj?.id) {
        setProjects((prev) => prev.map((p) => (p.id === newProj.id ? serverProj : p)));
      }
    } catch (e) {
      console.warn('Backend offline - added project in local state:', e);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await projectsApi.updateProject(id, updates);
    } catch (e) {
      console.warn('Backend offline - updated project in local state:', e);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await projectsApi.deleteProject(id);
    } catch (e) {
      console.warn('Backend offline - deleted project in local state:', e);
    }
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
        isLoading,
        setTaskView,
        setSearchQuery,
        setFieldPreferences,
        setProjectFilters,
        setSelectedTaskId,
        refreshData,
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
