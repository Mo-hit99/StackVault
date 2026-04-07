import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, LogOut, Terminal, User, Boxes } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl">
      <div className="glass-panel px-6 py-3 flex items-center justify-between shadow-2xl shadow-brand-500/10 backdrop-blur-2xl">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300">
            <Boxes className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-white mr-8">
            Stack<span className="text-brand-400">Vault</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${location.pathname === '/dashboard' ? 'bg-brand-500/20 text-brand-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
              >
                <LayoutDashboard size={18} />
                <span className="font-medium">Dashboard</span>
              </Link>

              <div className="w-px h-6 bg-white/10 mx-2" />

              <div className="flex items-center space-x-3 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                  <User size={16} className="text-slate-400" />
                </div>
                <span className="text-sm font-semibold text-slate-300 pr-2">@{user.username}</span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all font-medium ml-4"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </motion.button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors font-medium px-4">
                Sign In
              </Link>
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="brand-gradient text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg"
                >
                  Get Started
                </motion.button>
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
              <Terminal size={20} />
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
