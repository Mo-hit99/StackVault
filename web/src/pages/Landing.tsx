import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Globe, ArrowRight, Terminal } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card flex flex-col items-start"
  >
    <div className="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20">
      <Icon className="text-white w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

export const Landing = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative flex flex-col items-center pt-20 pb-32 px-4"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="text-center max-w-4xl mx-auto mb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-400 text-sm font-bold mb-8"
        >
          <Zap size={16} />
          <span>v1.0.0 is now live</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
          Version Control, <br />
          <span className="text-gradient">Reimagined.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          StackVault is a high-performance, minimalist alternative to Git. Built for velocity, clarity, and modern development workflows.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/register">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="brand-gradient text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={20} />
            </motion.button>
          </Link>
          
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.95 }}
              className="glass-panel px-10 py-4 rounded-2xl border border-white/10 font-bold text-lg text-white flex items-center space-x-3"
            >
              <Terminal size={20} />
              <span>Explore Source</span>
            </motion.button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 w-full">
        <FeatureCard 
          icon={Cpu}
          title="Lightweight Performance"
          description="Optimized for speed. Minimal overhead, zero bloat. Just pure versioning logic."
        />
        <FeatureCard 
          icon={Shield}
          title="Enterprise Security"
          description="End-to-end snapshots with cryptographic integrity. Your code is vaulted safely."
        />
        <FeatureCard 
          icon={Globe}
          title="Cloud Native"
          description="Designed to scale with your team. Seamless sync between CLI and Web Dashboard."
        />
      </div>
    </motion.div>
  );
};
