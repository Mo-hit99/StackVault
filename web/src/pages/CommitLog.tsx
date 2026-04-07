import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reposApi } from '../api/client';
import { CommitStack } from '../components/CommitStack';
import { motion } from 'framer-motion';
import { History, ArrowLeft, Book, ChevronLeft, ChevronRight } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  timestamp: string;
  author: string;
  parent_id: string | null;
  snapshot: Record<string, string>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export const CommitLog = () => {
  const { username, repo } = useParams<{ username: string; repo: string }>();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchCommits = async (page: number = 1) => {
    setLoading(true);
    try {
      const data: any = await reposApi.getCommits(username || '', repo || '', page, 10);
      const fetchedCommits = (data.commits || []).map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp).toISOString()
      }));
      setCommits(fetchedCommits);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits(1);
  }, [username, repo]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCommits(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          <span className="text-brand-400 font-bold text-sm">
            {pagination ? `${pagination.total} Total Commits` : `${commits.length} Commits`}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-white/5 z-0" />
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : (
          <CommitStack commits={commits} />
        )}
      </div>

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
    </motion.div>
  );
};
