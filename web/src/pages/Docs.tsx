import { BookOpen, Download, GitBranch, Laptop, TerminalSquare, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';

const installOptions = [
  {
    title: 'Install from npm',
    icon: Download,
    description: 'Best for developers who just want the CLI available globally.',
    commands: ['npm install -g gexra', 'gexra --help'],
  },
  {
    title: 'Build locally',
    icon: Laptop,
    description: 'Useful if you are working from the monorepo or testing local CLI changes.',
    commands: [
      'git clone https://github.com/anomalyco/stackvault.git',
      'cd stackvault/cli',
      'npm install',
      'npm run build',
      'npm link',
    ],
  },
];

const quickStart = [
  'gexra register <username> <email> <password> --url https://stack-vault-three.vercel.app',
  'gexra login <email> <password> --url https://stack-vault-three.vercel.app',
  'gexra init',
  'gexra create-repo <name> -d "My first repo"',
  'gexra remote add origin https://stack-vault-three.vercel.app',
  'gexra add .',
  'gexra commit -m "Initial commit"',
  'gexra push origin main',
];

const workflows = [
  {
    title: 'Everyday workflow',
    icon: Workflow,
    body: 'Initialize a project, stage files, create commits, and push to the StackVault server.',
    commands: ['gexra init', 'gexra add .', 'gexra status', 'gexra commit -m "Add feature"', 'gexra push origin main'],
  },
  {
    title: 'Partial path workflow',
    icon: GitBranch,
    body: 'Work only on one layer of a monorepo such as `web/` or `api/` without syncing everything.',
    commands: ['gexra add -p web', 'gexra commit -m "Polish docs UI" -p web', 'gexra push origin main -p web', 'gexra pull origin main -p api'],
  },
  {
    title: 'Clone a single area',
    icon: BookOpen,
    body: 'Clone a full repo or only one path when you want a narrower checkout.',
    commands: ['gexra clone https://your-server.com/api/repos/user/repo', 'gexra clone https://your-server.com/api/repos/user/repo --path web'],
  },
];

const commandGroups = [
  {
    title: 'Repository setup',
    commands: [
      ['gexra init', 'Initialize a new local StackVault repository.'],
      ['gexra remote add origin <url>', 'Connect the project to your StackVault server using the base URL only.'],
      ['gexra create-repo <name> -d "desc"', 'Create a remote repository before your first push.'],
    ],
  },
  {
    title: 'Staging and history',
    commands: [
      ['gexra add [files...]', 'Stage one or more files or folders.'],
      ['gexra add -p <path>', 'Stage only one path prefix such as `web` or `src/components`.'],
      ['gexra reset [files...]', 'Remove files from staging.'],
      ['gexra status', 'Inspect staged and unstaged changes.'],
      ['gexra commit -m "message"', 'Create a commit from staged changes.'],
      ['gexra log', 'View local commit history.'],
    ],
  },
  {
    title: 'Remote sync',
    commands: [
      ['gexra push [remote] [branch]', 'Push local commits to the remote server.'],
      ['gexra push origin main -p web', 'Push only one path prefix.'],
      ['gexra pull [remote] [branch]', 'Pull from the remote server into the current repo.'],
      ['gexra pull origin main -p api', 'Pull only one path prefix.'],
      ['gexra clone <url> --path <path>', 'Clone a repository, optionally scoped to one path.'],
    ],
  },
  {
    title: 'Authentication',
    commands: [
      ['gexra register <username> <email> <password> --url <server>', 'Create an account against a StackVault server.'],
      ['gexra login <email> <password> --url <server>', 'Sign in and persist credentials for protected operations.'],
    ],
  },
];

export const Docs = () => {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-10 shadow-[var(--shadow-md)] sm:px-8">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[260px]"
            style={{ background: 'radial-gradient(ellipse 520px 220px at 20% 0%, var(--accent-glow), transparent)' }}
          />
          <div className="relative max-w-[720px]">
            <div className="badge badge-orange px-3 py-1 uppercase tracking-[0.08em]">CLI Docs</div>
            <h1 className="mt-4 font-display text-[34px] leading-[1.1] text-[var(--text-primary)] sm:text-[46px]">
              Install the CLI, then ship with confidence.
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] text-[var(--text-secondary)] sm:text-[17px]">
              This guide covers npm installation, first-time setup, remote configuration, daily commands, and partial-path workflows for monorepos.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#install" className="btn btn-primary btn-lg">
                <Download size={16} />
                Install CLI
              </a>
              <a href="#commands" className="btn btn-secondary btn-lg">
                <TerminalSquare size={16} />
                View Commands
              </a>
            </div>
          </div>
        </section>

        <section id="install" className="mt-10">
          <div className="mb-5">
            <h2 className="text-[22px] font-bold text-[var(--text-primary)]">Installation</h2>
            <p className="mt-2 text-[14px] text-[var(--text-muted)]">
              Use the published npm package for the fastest setup, or link the local CLI while developing the monorepo.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {installOptions.map((option) => (
              <div key={option.title} className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <option.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">{option.title}</h3>
                    <p className="text-[13px] text-[var(--text-muted)]">{option.description}</p>
                  </div>
                </div>

                <div className="terminal-shell rounded-[var(--radius-lg)] p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="space-y-2 font-mono text-[13px] leading-[1.7]">
                    {option.commands.map((command) => (
                      <div key={command}>
                        <span style={{ color: 'var(--accent)' }}>$ </span>
                        <span className="terminal-text">{command}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="card">
            <h2 className="text-[22px] font-bold text-[var(--text-primary)]">Quick Start</h2>
            <p className="mt-2 text-[14px] text-[var(--text-muted)]">
              Start here if you want the shortest path from installation to your first push.
            </p>

            <div className="mt-5 space-y-3">
              {quickStart.map((command, index) => (
                <div key={command} className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[12px] font-semibold text-[var(--accent)]">
                    {index + 1}
                  </div>
                  <code className="font-mono text-[13px] text-[var(--text-primary)]">{command}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-[22px] font-bold text-[var(--text-primary)]">Helpful Notes</h2>
            <div className="mt-5 space-y-4 text-[14px] text-[var(--text-secondary)]">
              <p>Use the server base URL only when adding a remote, for example `https://stack-vault-three.vercel.app` and not `/api`.</p>
              <p>Path-scoped commands are great for monorepos. You can work only on `web`, `api`, or `src/components` without syncing the entire tree.</p>
              <p>Run `gexra status` before committing when you want a clear view of staged versus unstaged changes.</p>
              <p>Use `gexra --help` or any command with `--help` when you need option details while working in the terminal.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-[22px] font-bold text-[var(--text-primary)]">Common Workflows</h2>
            <p className="mt-2 text-[14px] text-[var(--text-muted)]">
              Pick the flow that matches how you work: full-repo sync, partial monorepo sync, or targeted clone.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {workflows.map((workflow) => (
              <div key={workflow.title} className="card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <workflow.icon size={18} />
                  </div>
                  <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">{workflow.title}</h3>
                </div>
                <p className="mb-4 text-[14px] text-[var(--text-muted)]">{workflow.body}</p>
                <div className="space-y-2">
                  {workflow.commands.map((command) => (
                    <div key={command} className="rounded-[var(--radius-md)] bg-[var(--bg-elevated)] px-3 py-2 font-mono text-[13px] text-[var(--text-primary)]">
                      {command}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="commands" className="mt-10">
          <div className="mb-5">
            <h2 className="text-[22px] font-bold text-[var(--text-primary)]">Command Reference</h2>
            <p className="mt-2 text-[14px] text-[var(--text-muted)]">
              A developer-friendly reference for the current CLI commands exposed by the app.
            </p>
          </div>

          <div className="space-y-5">
            {commandGroups.map((group) => (
              <div key={group.title} className="card">
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">{group.title}</h3>
                <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
                  {group.commands.map(([command, description], index) => (
                    <div
                      key={command}
                      className={`grid gap-2 px-4 py-3 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] ${index < group.commands.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
                    >
                      <code className="font-mono text-[13px] text-[var(--text-primary)]">{command}</code>
                      <p className="text-[14px] text-[var(--text-secondary)]">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-[var(--text-primary)]">Ready to try it?</h2>
              <p className="mt-2 text-[14px] text-[var(--text-muted)]">
                Create an account, connect a remote, and start pushing from the CLI.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary">
                Create Account
              </Link>
              <Link to="/" className="btn btn-secondary">
                Back Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
