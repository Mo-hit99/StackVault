import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { CodeViewer } from '../components/CodeViewer';
import { motion } from 'framer-motion';
import { File, Book, ChevronRight, Download, Copy, ArrowLeft } from 'lucide-react';

export const FileView = () => {
  const { username, repo } = useParams<{ username: string; repo: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filepath = query.get('filepath');

  const [blob, setBlob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlob = async () => {
      if (!filepath) return;
      try {
        const fileData = await api.get(`/repos/${username}/${repo}/blob?filepath=${encodeURIComponent(filepath)}`);
        setBlob(fileData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlob();
  }, [username, repo, filepath]);

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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
              <ChevronRight size={14} className="text-slate-700" />
              <Link to={`/${username}/${repo}`} className="hover:text-brand-400 transition-colors">{repo}</Link>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center space-x-3">
              <File className="text-brand-400" size={24} />
              <span className="font-mono">{filepath}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 glass-panel text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">
            <Copy size={16} />
            <span>Copy Raw</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl text-sm font-bold text-brand-400 hover:bg-brand-500/20 transition-all">
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-white/10 shadow-2xl">
        {blob ? (
          <CodeViewer content={blob.content} filename={filepath || 'unknown'} />
        ) : (
          <div className="text-center py-32 px-4">
            <File className="w-16 h-16 mx-auto mb-6 text-slate-700 underline decoration-red-500/50" />
            <h3 className="text-xl font-bold text-white mb-2">File not found</h3>
            <p className="text-slate-400 max-w-sm mx-auto">This file doesn't exist in the current snapshot.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

