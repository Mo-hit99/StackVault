import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reposApi } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { X, Lock, Globe, Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface RepoSettingsModalProps {
  repo: any;
  username: string;
  reponame: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RepoSettingsModal = ({ repo, username, reponame, isOpen, onClose }: RepoSettingsModalProps) => {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [name, setName] = useState(repo?.name || '');
  const [description, setDescription] = useState(repo?.description || '');
  const [isPrivate, setIsPrivate] = useState(repo?.is_private || false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const isOwner = user?.username === username;

  useEffect(() => {
    if (repo) {
      setName(repo.name || '');
      setDescription(repo.description || '');
      setIsPrivate(repo.is_private || false);
    }
  }, [repo]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    setLoading(true);
    setError('');
    
    try {
      await reposApi.update(username, reponame, {
        name,
        description,
        is_private: isPrivate
      });
      onClose();
      if (name !== reponame) {
        navigate(`/${username}/${name}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update repository');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    setDeleting(true);
    setError('');
    
    try {
      await reposApi.delete(username, reponame);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to delete repository');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel w-full max-w-lg p-8 relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">Repository Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {!isOwner ? (
          <div className="text-center py-8">
            <p className="text-slate-400">You don't have permission to manage this repository.</p>
          </div>
        ) : showDelete ? (
          <div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 text-red-400 mb-4">
                <AlertTriangle size={24} />
                <span className="font-bold text-lg">Delete Repository</span>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Are you sure you want to delete <span className="font-bold text-white">{username}/{reponame}</span>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-500 border border-red-500 rounded-xl text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Repository Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 transition-colors font-medium"
                required
                pattern="[a-z0-9-_]+"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500/50 transition-colors font-medium resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                Visibility
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrivate(false)}
                  className={`p-4 rounded-xl border transition-all ${
                    !isPrivate
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Globe size={20} className="mx-auto mb-2" />
                  <div className="font-bold text-sm">Public</div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivate(true)}
                  className={`p-4 rounded-xl border transition-all ${
                    isPrivate
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Lock size={20} className="mx-auto mb-2" />
                  <div className="font-bold text-sm">Private</div>
                </button>
              </div>
            </div>

            <div className="pt-4 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 brand-gradient text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="px-6 py-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-bold"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};