import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem('stackvault-theme') as Theme) || 'light',
  toggle: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('stackvault-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return { theme: next };
    }),
  setTheme: (t) => {
    localStorage.setItem('stackvault-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    set({ theme: t });
  },
}));
