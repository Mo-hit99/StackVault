import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (method: string, path: string, body: any = null) => {
  const token = useAuthStore.getState().token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || res.statusText);
  }
  
  return await res.json();
};

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body?: any) => request('POST', path, body),
  put: (path: string, body?: any) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
};

export const reposApi = {
  list: (username: string, page = 1, limit = 12) => api.get(`/repos/${username}?page=${page}&limit=${limit}`),
  get: (username: string, reponame: string) => api.get(`/repos/${username}/${reponame}`),
  create: (data: { name: string; description?: string; is_private?: boolean }) => api.post('/repos/create', data),
  update: (username: string, reponame: string, data: { name?: string; description?: string; is_private?: boolean }) => api.put(`/repos/${username}/${reponame}`, data),
  delete: (username: string, reponame: string) => api.delete(`/repos/${username}/${reponame}`),
  getCommits: (username: string, reponame: string, page = 1, limit = 20) => api.get(`/repos/${username}/${reponame}/commits?page=${page}&limit=${limit}`),
  push: (username: string, reponame: string, data: { commits: any[]; blobs: any[] }) => api.post(`/repos/${username}/${reponame}/push`, data),
  pull: (username: string, reponame: string) => api.get(`/repos/${username}/${reponame}/pull`),
  getStatsMy: () => api.get('/repos/me/stats'),
};
