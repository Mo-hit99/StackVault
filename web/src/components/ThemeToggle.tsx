import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="btn btn-ghost btn-icon"
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      type="button"
    >
      {theme === 'dark' ? (
        <Sun size={18} style={{ color: 'var(--text-secondary)' }} />
      ) : (
        <Moon size={18} style={{ color: 'var(--text-secondary)' }} />
      )}
    </button>
  );
}
