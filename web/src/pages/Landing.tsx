import { GitBranch, GitCommit, FolderOpen, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: GitCommit,
    title: 'Stack-based commits',
    body: 'Every commit is a node in a stack - push, pop, traverse.',
  },
  {
    icon: FolderOpen,
    title: 'Partial clone by path',
    body: 'Clone only src/components - save bandwidth, work modularly.',
  },
  {
    icon: Terminal,
    title: 'CLI + Web in sync',
    body: 'sv push from your terminal, browse on the web instantly.',
  },
];

export const Landing = () => {
  return (
    <div className="relative overflow-hidden px-4 pb-20 pt-8 sm:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[520px] max-w-[1200px]"
        style={{
          background: 'radial-gradient(ellipse 800px 500px at 50% 0%, var(--accent-glow), transparent)',
        }}
      />

      <section className="relative mx-auto flex min-h-[80vh] max-w-[1100px] flex-col items-center justify-center py-16 text-center">
        <div className="badge badge-orange px-3 py-1 text-[12px] uppercase tracking-[0.08em]">
          Open Source / Version Control / Modular
        </div>

        <h1 className="font-display mt-5 whitespace-pre-line text-[36px] leading-[1.15] text-[var(--text-primary)] sm:text-[46px] lg:text-[56px]">
          {'Version control,\nmodular by design.'}
        </h1>

        <p className="mt-5 max-w-[480px] text-[16px] text-[var(--text-secondary)] sm:text-[18px]">
          Push, pull, commit, and clone - any folder, any file. Built for developers who think in layers.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started
          </Link>
          <Link to="/docs" className="btn btn-secondary btn-lg">
            <Terminal size={18} />
            Read Docs
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">
            <GitBranch size={18} />
            View on GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto mt-4 grid max-w-[900px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="card card-hover">
            <feature.icon size={28} className="mb-4 text-[var(--accent)]" />
            <h2 className="mb-2 text-[16px] font-bold text-[var(--text-primary)]">{feature.title}</h2>
            <p className="text-[14px] text-[var(--text-muted)]">{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="terminal-shell mx-auto mt-20 max-w-[640px] rounded-[var(--radius-xl)] px-5 py-5" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="mb-4 flex gap-2">
          <span className="terminal-dot-red h-[10px] w-[10px] rounded-full" />
          <span className="terminal-dot-yellow h-[10px] w-[10px] rounded-full" />
          <span className="terminal-dot-green h-[10px] w-[10px] rounded-full" />
        </div>

        <div className="space-y-2 font-mono text-[13px] leading-[1.7]">
          {['sv init', 'sv add .', 'sv commit -m "first commit"', 'sv push origin main'].map((command) => (
            <div key={command}>
              <span style={{ color: 'var(--accent)' }}>$ </span>
              <span className="terminal-text">{command}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
