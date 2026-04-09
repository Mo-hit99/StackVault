import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async <TResponse>(method: string, path: string, body?: unknown): Promise<TResponse> => {
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
  
  return (await res.json()) as TResponse;
};

export const api = {
  get: <TResponse>(path: string) => request<TResponse>('GET', path),
  post: <TResponse>(path: string, body?: unknown) => request<TResponse>('POST', path, body),
  put: <TResponse>(path: string, body?: unknown) => request<TResponse>('PUT', path, body),
  delete: <TResponse>(path: string) => request<TResponse>('DELETE', path),
};

export const reposApi = {
  list: (username: string, page = 1, limit = 12) => api.get(`/repos/${username}?page=${page}&limit=${limit}`),
  get: (username: string, reponame: string) => api.get(`/repos/${username}/${reponame}`),
  create: (data: { name: string; description?: string; is_private?: boolean }) => api.post('/repos/create', data),
  update: (username: string, reponame: string, data: { name?: string; description?: string; is_private?: boolean }) => api.put(`/repos/${username}/${reponame}`, data),
  delete: (username: string, reponame: string) => api.delete(`/repos/${username}/${reponame}`),
  getCommits: (username: string, reponame: string, page = 1, limit = 20) => api.get(`/repos/${username}/${reponame}/commits?page=${page}&limit=${limit}`),
  push: (username: string, reponame: string, data: { commits: unknown[]; blobs: unknown[] }) => api.post(`/repos/${username}/${reponame}/push`, data),
  pull: (username: string, reponame: string) => api.get(`/repos/${username}/${reponame}/pull`),
  getStatsMy: () => api.get('/repos/me/stats'),
};
