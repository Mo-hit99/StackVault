import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reposApi } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Plus, Book, GitCommit, Activity, ChevronRight, Lock, Globe, ChevronLeft } from 'lucide-react';
import { CreateRepoModal } from '../components/CreateRepoModal';

export const Dashboard = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const fetchRepos = async (page: number = 1) => {
    setLoading(true);
    try {
      if (!user) return;
      const [reposData, statsData] = await Promise.all([
        reposApi.list(user.username, page, 9),
        reposApi.getStatsMy()
      ]);
      setRepos(reposData.repos || []);
      setStats(statsData);
      if (reposData.pagination) {
        setPagination(reposData.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRepos(1);
  }, [user, navigate]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      fetchRepos(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && repos.length === 0) return (
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
          onClick={() => setShowCreateModal(true)}
          className="brand-gradient text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-brand-500/20"
        >
          <Plus size={20} />
          <span>New Repository</span>
        </motion.button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Book, label: 'Repositories', value: stats?.repos || pagination?.total || repos.length, color: 'brand' },
          { icon: GitCommit, label: 'Total Commits', value: stats?.commits || 0, color: 'indigo' },
          { icon: Activity, label: 'Active Projects', value: stats?.activeProjects || 0, color: 'pink' },
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

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Recent Repositories</span>
          <span className="w-8 h-px bg-white/10" />
        </h2>
        {pagination && (
          <span className="text-sm text-slate-500">
            Showing {repos.length} of {pagination.total}
          </span>
        )}
      </div>

      {repos.length === 0 ? (
        <div className="glass-panel text-center py-20 px-4">
          <Book className="w-16 h-16 mx-auto mb-6 text-slate-700" />
          <h3 className="text-xl font-bold text-white mb-2">No repositories yet</h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">Get started by creating your first repository to track your project history.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl border border-white/10 transition-colors font-bold"
          >
            Create First Repo
          </button>
        </div>
      ) : (
        <>
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

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                        pagination.page === pageNum
                          ? 'bg-brand-500 text-white'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasMore}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {pagination && (
            <div className="text-center mt-4 text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          )}
        </>
      )}

      <CreateRepoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchRepos(1);
        }}
      />
    </motion.div>
  );
};
