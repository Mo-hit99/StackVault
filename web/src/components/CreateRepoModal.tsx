import { Loader2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { reposApi } from '../api/client';

interface RepoRecord {
  id?: number | string;
  name: string;
  description?: string | null;
  is_private?: boolean;
  created_at?: string;
}

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (repo: RepoRecord) => void;
}

export const CreateRepoModal = ({ isOpen, onClose, onSuccess }: CreateRepoModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const repo = (await reposApi.create({
        name,
        description,
        is_private: isPrivate,
      })) as RepoRecord;

      onSuccess(repo);
      setName('');
      setDescription('');
      setIsPrivate(false);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create repository';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close create repository modal"
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
        onClick={onClose}
      />

      <div className="card animate-scale-in relative z-10 w-full max-w-[440px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Create Repository</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(event) => setIsPrivate(event.target.checked)}
            />
            <span>Make private</span>
          </label>

          {error ? (
            <div className="rounded-[var(--radius-md)] border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--red)', color: 'var(--red)', background: 'var(--red-soft)' }}>
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
