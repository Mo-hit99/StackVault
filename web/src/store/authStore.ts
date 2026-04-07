import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
}

// Simple store for auth state
export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('sv_user') || 'null'),
  token: localStorage.getItem('sv_token') || null,

  login: (userData, tokenData) => {
    localStorage.setItem('sv_user', JSON.stringify(userData));
    localStorage.setItem('sv_token', tokenData);
    set({ user: userData, token: tokenData });
  },

  logout: () => {
    localStorage.removeItem('sv_user');
    localStorage.removeItem('sv_token');
    set({ user: null, token: null });
  }
}));
