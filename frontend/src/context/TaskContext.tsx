'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, Member, Subtask } from '../types/task';
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
    try {
      const updated = await tasksApi.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      console.error(`Failed to update task ${id} via API:`, e);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (selectedTaskId === id) setSelectedTaskId(null);
    } catch (e) {
      console.error(`Failed to delete task ${id} via API:`, e);
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
    try {
      await subtasksApi.createSubtask(taskId, title);
      const updatedTask = await tasksApi.getTaskById(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to add subtask:', e);
    }
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const subtask = task?.subtasks.find((s) => s.id === subtaskId);
    if (!subtask) return;

    try {
      await subtasksApi.updateSubtask(subtaskId, { completed: !subtask.completed });
      const updatedTask = await tasksApi.getTaskById(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to toggle subtask:', e);
    }
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await subtasksApi.deleteSubtask(subtaskId);
      const updatedTask = await tasksApi.getTaskById(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to delete subtask:', e);
    }
  };

  const addComment = async (taskId: string, content: string) => {
    if (!content.trim()) return;
    try {
      await commentsApi.addComment(taskId, content);
      const updatedTask = await tasksApi.getTaskById(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to add comment:', e);
    }
  };

  const addResource = async (taskId: string, title: string, url: string) => {
    try {
      const updatedTask = await tasksApi.addResource(taskId, title, url);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to add resource:', e);
    }
  };

  const toggleMemberOnTask = async (taskId: string, memberId: string) => {
    try {
      const updatedTask = await tasksApi.toggleMember(taskId, memberId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to toggle member:', e);
    }
  };

  const toggleLabelOnTask = async (taskId: string, label: string) => {
    try {
      const updatedTask = await tasksApi.toggleLabel(taskId, label);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      console.error('Failed to toggle label:', e);
    }
  };

  // Project Actions
  const addProject = async (projectData: Partial<Project>) => {
    try {
      const newProj = await projectsApi.createProject(projectData);
      setProjects((prev) => [...prev, newProj]);
    } catch (e) {
      console.error('Failed to add project:', e);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updated = await projectsApi.updateProject(id, updates);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      console.error('Failed to update project:', e);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error('Failed to delete project:', e);
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
