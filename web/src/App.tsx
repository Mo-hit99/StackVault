import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { useAuthStore } from './store/authStore';

const Landing = lazy(() => import('./pages/Landing').then((module) => ({ default: module.Landing })));
const Docs = lazy(() => import('./pages/Docs').then((module) => ({ default: module.Docs })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then((module) => ({ default: module.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const RepoView = lazy(() => import('./pages/RepoView').then((module) => ({ default: module.RepoView })));
const CommitLog = lazy(() => import('./pages/CommitLog').then((module) => ({ default: module.CommitLog })));
const FileView = lazy(() => import('./pages/FileView').then((module) => ({ default: module.FileView })));

const RouteLoadingFallback = () => (
  <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-10">
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-4 text-[14px] text-[var(--text-muted)] shadow-[var(--shadow-sm)]">
      Loading page...
    </div>
  </div>
);

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated && Boolean(s.user) && Boolean(s.token));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated && Boolean(s.user) && Boolean(s.token));

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/:username/:repo" element={<RepoView />} />
          <Route path="/:username/:repo/commits" element={<CommitLog />} />
          <Route path="/:username/:repo/blob" element={<FileView />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-base)] pt-14">
        <Navbar />
        <main className="min-h-[calc(100vh-56px)]">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
