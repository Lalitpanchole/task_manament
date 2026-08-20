export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return 'https://task-manament.vercel.app/api';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
}


const TOKEN_KEY = 'ablespace_auth_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Add 8-second timeout so deployed app doesn't hang indefinitely if Render backend is sleeping/down
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = json.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return json.data !== undefined ? json.data : json;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('API request timed out (Backend server is offline or sleeping)');
    }
    throw error;
  }
}

export const authApi = {
  loginAsGuest: async () => {
    const res = await apiFetch<{ user: any; token: string }>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    setAuthToken(res.token);
    return res.user;
  },

  loginWithGoogle: async (params?: { email?: string; name?: string; avatar?: string }) => {
    const res = await apiFetch<{ user: any; token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
    setAuthToken(res.token);
    return res.user;
  },

  getMe: async () => {
    return apiFetch<any>('/auth/me');
  },

  logout: async () => {
    try {
      await apiFetch<any>('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
    }
  },
};

export const usersApi = {
  getUsers: async () => {
    return apiFetch<any[]>('/users');
  },

  updateProfile: async (data: any) => {
    return apiFetch<any>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

export const tasksApi = {
  getTasks: async (params?: Record<string, string>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<any[]>(`/tasks${queryString}`);
  },

  getTaskById: async (id: string) => {
    return apiFetch<any>(`/tasks/${id}`);
  },

  createTask: async (taskData: any) => {
    return apiFetch<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (id: string, updates: any) => {
    return apiFetch<any>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  deleteTask: async (id: string) => {
    return apiFetch<any>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  toggleMember: async (taskId: string, memberId: string) => {
    return apiFetch<any>(`/tasks/${taskId}/members`, {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });
  },

  toggleLabel: async (taskId: string, label: string) => {
    return apiFetch<any>(`/tasks/${taskId}/labels`, {
      method: 'POST',
      body: JSON.stringify({ label }),
    });
  },

  addResource: async (taskId: string, title: string, url: string) => {
    return apiFetch<any>(`/tasks/${taskId}/resources`, {
      method: 'POST',
      body: JSON.stringify({ title, url }),
    });
  },
};

export const subtasksApi = {
  createSubtask: async (taskId: string, title: string) => {
    return apiFetch<any>(`/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  updateSubtask: async (id: string, updates: any) => {
    return apiFetch<any>(`/subtasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  deleteSubtask: async (id: string) => {
    return apiFetch<any>(`/subtasks/${id}`, {
      method: 'DELETE',
    });
  },
};

export const commentsApi = {
  getComments: async (taskId: string) => {
    return apiFetch<any[]>(`/tasks/${taskId}/comments`);
  },

  addComment: async (taskId: string, content: string) => {
    return apiFetch<any>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (id: string) => {
    return apiFetch<any>(`/comments/${id}`, {
      method: 'DELETE',
    });
  },
};

export const projectsApi = {
  getProjects: async () => {
    return apiFetch<any[]>('/projects');
  },

  getProjectById: async (id: string) => {
    return apiFetch<any>(`/projects/${id}`);
  },

  createProject: async (projectData: any) => {
    return apiFetch<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  updateProject: async (id: string, updates: any) => {
    return apiFetch<any>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  deleteProject: async (id: string) => {
    return apiFetch<any>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  getProjectTasks: async (id: string) => {
    return apiFetch<any[]>(`/projects/${id}/tasks`);
  },
};
