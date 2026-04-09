import { Menu} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const isLoggedIn = Boolean(user);

  const navItems = isLoggedIn
    ? [
        { label: 'Repos', to: '/dashboard', active: location.pathname === '/dashboard' },
        { label: 'Docs', to: '/docs', active: location.pathname === '/docs' },
      ]
    : [{ label: 'Docs', to: '/docs', active: location.pathname === '/docs' }];

  return (
    <nav
      className="fixed top-0 z-50 w-full border-b bg-[var(--bg-surface)]"
      style={{
        height: '56px',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link to={isLoggedIn ? '/dashboard' : '/'} className="font-display text-[20px] text-[var(--accent)]">
            StackVault
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`inline-flex h-14 items-center border-b-2 px-3 text-[14px] font-medium ${
                  item.active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{ borderBottomColor: item.active ? 'var(--accent)' : 'transparent' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="btn btn-ghost btn-icon md:hidden" aria-label="Open navigation menu">
            <Menu size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>

          <ThemeToggle />

          {isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost btn-sm hidden sm:inline-flex"
              >
                Logout
              </button>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border text-[13px] font-semibold"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  borderColor: 'var(--accent-soft)',
                }}
                title={user?.username}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
