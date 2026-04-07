import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Plus, Book, GitCommit, Activity, ChevronRight, Lock, Globe } from 'lucide-react';

export const Dashboard = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchRepos = async () => {
      try {
        if (!user) return;
        const data = await api.get(`/repos/${user.username}`);
        setRepos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [user, navigate]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Welcome back, {user?.username}</h1>
          <p className="text-slate-400">Manage your repositories and track your latest activity.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="brand-gradient text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-brand-500/20"
        >
          <Plus size={20} />
          <span>New Repository</span>
        </motion.button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Book, label: 'Repositories', value: repos.length, color: 'brand' },
          { icon: GitCommit, label: 'Total Commits', value: '124', color: 'indigo' },
          { icon: Activity, label: 'Active Projects', value: '3', color: 'pink' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-400`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Recent Repositories</span>
          <span className="w-8 h-px bg-white/10" />
        </h2>
      </div>

      {repos.length === 0 ? (
        <div className="glass-panel text-center py-20 px-4">
          <Book className="w-16 h-16 mx-auto mb-6 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">No repositories yet</h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">Get started by creating your first repository to track your project history.</p>
          <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl border border-white/10 transition-colors font-bold">
            Create First Repo
          </button>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {repos.map(repo => (
            <motion.div key={repo.id} variants={item}>
              <Link to={`/${user?.username}/${repo.name}`} className="block group h-full">
                <div className="glass-card h-full flex flex-col group-hover:border-brand-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 text-slate-400 group-hover:text-brand-400 transition-colors">
                        <Book size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight">{repo.name}</h3>
                    </div>
                    {repo.is_private ? (
                      <Lock size={14} className="text-slate-500" />
                    ) : (
                      <Globe size={14} className="text-slate-500" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">
                    {repo.description || 'Seamlessly versioned with StackVault.'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-xs font-semibold text-slate-500">
                      Updated {new Date(repo.created_at).toLocaleDateString()}
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

