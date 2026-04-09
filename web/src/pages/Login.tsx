import { AlertTriangle, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = (await api.post('/auth/login', { email, password })) as {
        user: Parameters<typeof login>[0];
        token: string;
      };
      login(data.user, data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[var(--bg-base)] px-4 py-8">
      <div className="card animate-scale-in w-full max-w-[420px] rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-lg)] sm:p-10">
        <div className="text-center">
          <Link to="/" className="font-display text-[22px] text-[var(--accent)]">
            StackVault
          </Link>
          <h1 className="mt-6 font-display text-[28px] text-[var(--text-primary)]">Log in</h1>
          <p className="mt-2 text-[14px] text-[var(--text-muted)]">Continue into your repositories and commit history.</p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <div className="flex gap-2 rounded-[var(--radius-md)] border px-3 py-3 text-[13px]" style={{ background: 'var(--red-soft)', borderColor: 'var(--red)', color: 'var(--red)' }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Email</label>
            <input className="input input-lg" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Password</label>
            <input className="input input-lg" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full justify-center" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Log in
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-[var(--text-muted)]">
          Don&apos;t have an account? <Link to="/register" className="text-[var(--accent)]">Register</Link>
        </p>
      </div>
    </div>
  );
};
