import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { RepoView } from './pages/RepoView';
import { CommitLog } from './pages/CommitLog';
import { FileView } from './pages/FileView';
import { useAuthStore } from './store/authStore';
import { AnimatePresence } from 'framer-motion';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(s => s.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/:username/:repo" element={<RepoView />} />
        <Route path="/:username/:repo/commits" element={<CommitLog />} />
        <Route path="/:username/:repo/blob" element={<FileView />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col pt-24">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        
        {/* Global Mesh Gradient Overlays */}
        <div className="fixed inset-0 pointer-events-none z-[-1] opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        </div>
      </div>
    </Router>
  );
}

export default App;
