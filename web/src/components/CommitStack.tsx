import { motion } from 'framer-motion';
import { User, Calendar, ExternalLink, GitCommit } from 'lucide-react';

export interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  snapshot: Record<string, string>;
}

export const CommitStack = ({ commits }: { commits: Commit[] }) => {
  if (!commits || commits.length === 0) {
    return (
      <div className="glass-panel text-center py-20 px-4">
        <GitCommit className="w-16 h-16 mx-auto mb-6 text-slate-700" />
        <h3 className="text-xl font-bold text-white mb-2">No commits found</h3>
        <p className="text-slate-400 max-w-sm mx-auto">This repository hasn't had any activity yet.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 relative z-10"
    >
      {commits.map((c) => (
        <motion.div key={c.id} variants={item} className="relative pl-14 group">
          {/* Timeline Node */}
          <div className="absolute left-[20px] top-6 w-4 h-4 rounded-full border-[3px] border-brand-500 bg-dark-950 z-20 shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:scale-125 group-hover:bg-brand-500 transition-all duration-300" />
          
          <div className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:border-brand-500/30 transition-all duration-300">
            <div className="flex-1">
              <h3 className="text-lg font-black text-white group-hover:text-brand-400 transition-colors leading-tight mb-2">
                {c.message}
              </h3>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm">
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <User size={12} className="text-slate-500" />
                  </div>
                  <span className="font-bold text-slate-300">@{c.author || 'system'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-500">
                  <Calendar size={14} />
                  <span>{new Date(c.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-all">
                {c.id.substring(0, 8)}
              </div>
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

