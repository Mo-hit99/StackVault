import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CommitStack, Commit } from '../components/CommitStack';
import { motion } from 'framer-motion';
import { History, ArrowLeft, Book } from 'lucide-react';

export const CommitLog = () => {
  const { username, repo } = useParams<{ username: string; repo: string }>();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const data = await api.get(`/repos/${username}/${repo}/commits`);
        setCommits(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommits();
  }, [username, repo]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to={`/${username}/${repo}`}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-500 mb-1">
              <Book size={14} />
              <span>{username}</span>
              <span>/</span>
              <span className="text-slate-300">{repo}</span>
            </div>
            <h1 className="text-3xl font-black text-white flex items-center space-x-3">
              <History className="text-brand-400" size={28} />
              <span>Commit History</span>
            </h1>
          </div>
        </div>
        
        <div className="px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl">
          <span className="text-brand-400 font-bold text-sm">{commits.length} Total Commits</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-white/5 z-0" />
        
        <CommitStack commits={commits} />
      </div>
    </motion.div>
  );
};

