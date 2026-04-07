import { useState } from 'react';
import { reposApi } from '../api/client';
import { motion } from 'framer-motion';
import { X, Lock, Globe, Loader2 } from 'lucide-react';

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (repo: any) => void;
}

export const CreateRepoModal = ({ isOpen, onClose, onSuccess }: CreateRepoModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const repo = await reposApi.create({
        name,
        description,
        is_private: isPrivate
      });
      onSuccess(repo);
      onClose();
      setName('');
      setDescription('');
      setIsPrivate(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create repository');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-black text-white">Create Repository</h2>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
              Repository Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
              placeholder="my-awesome-project"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-medium"
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
              placeholder="A brief description of your project"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-medium resize-none"
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
                <div className="text-xs mt-1 opacity-60">Anyone can view</div>
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
                <div className="text-xs mt-1 opacity-60">Only you can view</div>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !name}
              className="w-full brand-gradient text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Create Repository</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
