import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { reposApi } from '../api/client';
import { FileTree } from '../components/FileTree';
import { RepoSettingsModal } from '../components/RepoSettingsModal';
import { motion } from 'framer-motion';
import { Book, GitCommit, Settings, Code, Star, GitFork, Eye, Activity, Clock, Upload } from 'lucide-react';

export const RepoView = () => {
  const { username, repo } = useParams<{ username: string; repo: string }>();
  const location = useLocation();
  const [repoData, setRepoData] = useState<any>(null);
  const [commits, setCommits] = useState<any[]>([]);
  const [snapshot, setSnapshot] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchFullView = async () => {
      try {
        const repoDetails = await reposApi.get(username || '', repo || '');
        setRepoData(repoDetails);

        const commitsRes = await reposApi.getCommits(username || '', repo || '', 1, 10);
        if (commitsRes.commits && commitsRes.commits.length > 0) {
          setCommits(commitsRes.commits);
          setSnapshot(commitsRes.commits[0].snapshot);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullView();
  }, [username, repo]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
  
  if (!repoData) return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <div className="glass-panel p-12 inline-block">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Repository not found</h2>
        <p className="text-slate-400">The repository you're looking for doesn't exist or is private.</p>
        <Link to="/dashboard" className="mt-6 inline-block text-brand-400 hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );

  const isCommitsPage = location.pathname.endsWith('/commits');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-6 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Book className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center text-2xl font-black text-white tracking-tight">
              <Link to={`/${username}`} className="text-slate-400 hover:text-brand-400 transition-colors">{username}</Link>
              <span className="mx-2 text-slate-600">/</span>
              <span className="text-white">{repoData.name}</span>
              {repoData.is_private && (
                <span className="ml-3 text-[10px] uppercase tracking-widest font-black border border-white/10 bg-white/5 py-1 px-3 rounded-full text-slate-500">Private</span>
              )}
            </div>
            <p className="text-slate-400 mt-1 font-medium">{repoData.description || 'Seamlessly versioned with StackVault.'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {[
            { icon: Eye, label: 'Watch', count: '1' },
            { icon: Star, label: 'Star', count: '0' },
            { icon: GitFork, label: 'Fork', count: '0' },
          ].map((action, i) => (
            <button key={i} className="flex items-center space-x-2 px-3 py-1.5 glass-panel text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors">
              <action.icon size={14} />
              <span>{action.label}</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded-md min-w-[20px]">{action.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
        <Link 
          to={`/${username}/${repo}`} 
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-200 ${!isCommitsPage ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          <Code size={18} />
          <span className="font-bold">Code</span>
        </Link>
        <Link 
          to={`/${username}/${repo}/commits`} 
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl transition-all duration-200 ${isCommitsPage ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          <GitCommit size={18} />
          <span className="font-bold">Commits</span>
        </Link>
        <button 
          onClick={() => setShowSettings(true)}
          className="flex items-center space-x-2 px-6 py-2 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <Settings size={18} />
          <span className="font-bold">Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <FileTree snapshot={snapshot || {}} username={username || ''} repo={repo || ''} />
          
          {commits.length > 0 && (
            <div className="glass-panel overflow-hidden border border-white/10">
              <div className="bg-dark-900/80 backdrop-blur-md px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center text-sm font-black text-white uppercase tracking-widest">
                  <Upload className="w-5 h-5 mr-3 text-brand-400" />
                  <span>Recent Pushes</span>
                </div>
                <Link 
                  to={`/${username}/${repo}/commits`}
                  className="text-xs font-bold text-brand-400 hover:text-brand-300"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {commits.slice(0, 5).map((commit, index) => (
                  <motion.div 
                    key={commit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.03] transition-all"
                  >
                    <Link 
                      to={`/${username}/${repo}/commits?commit=${commit.id}`}
                      className="flex items-center px-6 py-4"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center mr-4">
                        <GitCommit className="w-4 h-4 text-brand-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-300 truncate">
                          {commit.message}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-2">
                          <span>{commit.author}</span>
                          <span>·</span>
                          <span>{new Date(commit.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-slate-600">
                        {commit.id.slice(0, 7)}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">About</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {repoData.description || 'No description, website, or topics provided.'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold">
              <Activity size={12} />
              <span>Last active {new Date(repoData.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Languages</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-400">TypeScript</span>
                  <span className="text-slate-500">82.4%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '82.4%' }} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-purple-400">CSS</span>
                  <span className="text-slate-500">17.6%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '17.6%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RepoSettingsModal
        repo={repoData}
        username={username || ''}
        reponame={repo || ''}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </motion.div>
  );
};

