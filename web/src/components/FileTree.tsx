import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCode, FolderOpen, ChevronRight, File, HardDrive } from 'lucide-react';

export interface FileTreeProps {
  snapshot: Record<string, string>;
  username: string;
  repo: string;
}

export const FileTree = ({ snapshot, username, repo }: FileTreeProps) => {
  if (!snapshot || Object.keys(snapshot).length === 0) {
    return (
      <div className="glass-panel text-center py-20 px-4">
        <HardDrive className="w-16 h-16 mx-auto mb-6 text-slate-700" />
        <h3 className="text-xl font-bold text-white mb-2">Repository is empty</h3>
        <p className="text-slate-400 max-w-sm mx-auto">Push your first commit to see your files here.</p>
      </div>
    );
  }

  const files = Object.keys(snapshot).sort();

  return (
    <div className="glass-panel overflow-hidden border border-white/10 shadow-2xl">
      <div className="bg-dark-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center text-sm font-black text-white uppercase tracking-widest">
          <FolderOpen className="w-5 h-5 mr-3 text-brand-400" />
          <span>Files</span>
        </div>
        <div className="text-xs font-bold text-slate-500">
          {files.length} items
        </div>
      </div>
      
      <div className="divide-y divide-white/5">
        {files.map((filepath, index) => {
          const isCode = filepath.match(/\.(ts|tsx|js|jsx|py|go|rs|c|cpp|h|css|html|json)$/);
          const Icon = isCode ? FileCode : File;
          
          return (
            <motion.div 
              key={filepath}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="hover:bg-white/[0.03] transition-all group"
            >
              <Link 
                to={`/${username}/${repo}/blob?filepath=${encodeURIComponent(filepath)}`}
                className="flex items-center px-6 py-4"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`w-4 h-4 ${isCode ? 'text-brand-400' : 'text-slate-500'} group-hover:text-brand-300 transition-colors`} />
                </div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  {filepath}
                </span>
                <ChevronRight className="ml-auto w-4 h-4 text-slate-700 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

