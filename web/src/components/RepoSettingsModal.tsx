import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reposApi } from '../api/client';
import { useAuthStore } from '../store/authStore';

interface RepoData {
  name: string;
  description?: string | null;
  is_private?: boolean;
}

interface RepoSettingsModalProps {
  repo: RepoData | null;
  username: string;
  reponame: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RepoSettingsModal = ({ repo, username, reponame, isOpen, onClose }: RepoSettingsModalProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(repo?.name ?? '');
  const [description, setDescription] = useState(repo?.description ?? '');
  const [isPrivate, setIsPrivate] = useState(Boolean(repo?.is_private));
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState('');

  const isOwner = user?.username === username;

  useEffect(() => {
    setName(repo?.name ?? '');
    setDescription(repo?.description ?? '');
    setIsPrivate(Boolean(repo?.is_private));
  }, [repo]);

  if (!isOpen) {
    return null;
  }

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOwner) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reposApi.update(username, reponame, { name, description, is_private: isPrivate });
      onClose();
      if (name !== reponame) {
        navigate(`/${username}/${name}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update repository');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await reposApi.delete(username, reponame);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete repository');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" aria-label="Close settings modal" onClick={onClose} />
      <div className="card animate-scale-in relative z-10 w-full max-w-[440px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Repository Settings</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {!isOwner ? (
          <p className="text-[14px] text-[var(--text-muted)]">Only the repository owner can edit these settings.</p>
        ) : showDelete ? (
          <div className="space-y-4">
            <div className="rounded-[var(--radius-md)] border px-4 py-4" style={{ borderColor: 'var(--red)', background: 'var(--red-soft)' }}>
              <div className="mb-2 flex items-center gap-2 text-[var(--red)]">
                <AlertTriangle size={16} />
                <span className="text-[14px] font-semibold">Delete Repository</span>
              </div>
              <p className="text-[13px] text-[var(--red)]">
                Delete {username}/{reponame}? This action cannot be undone.
              </p>
            </div>

            {error ? <p className="text-[13px] text-[var(--red)]">{error}</p> : null}

            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Name</label>
              <input
                className="input"
                required
                value={name}
                onChange={(event) => setName(event.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[var(--text-secondary)]">Description</label>
              <textarea
                className="input"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-3 text-[14px] text-[var(--text-secondary)]">
              <input type="checkbox" checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} />
              <span>Private repository</span>
            </label>

            {error ? <p className="text-[13px] text-[var(--red)]">{error}</p> : null}

            <div className="flex justify-between gap-2 pt-2">
              <button type="button" className="btn btn-danger" onClick={() => setShowDelete(true)}>
                <Trash2 size={15} />
                Delete
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
