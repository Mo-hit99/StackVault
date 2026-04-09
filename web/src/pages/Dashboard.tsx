import { ChevronLeft, ChevronRight, Plus, GitBranch, GitCommit, ArrowUpRight, Clock3, GitFork } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { reposApi } from '../api/client';
import { CreateRepoModal } from '../components/CreateRepoModal';
import { useAuthStore } from '../store/authStore';
import { formatRelativeTime, getStaggerClass } from '../lib/format';

interface RepoRecord {
  id?: number | string;
  name: string;
  description?: string | null;
  is_private?: boolean;
  created_at?: string;
  updated_at?: string;
  commit_count?: number;
}

interface PaginationData {
  page: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface StatsData {
  repos?: number;
  commits?: number;
}

interface RepoListResponse {
  repos?: RepoRecord[];
  pagination?: PaginationData;
}

interface RepoCommitsResponse {
  commits?: Array<{ id: string }>;
  pagination?: {
    total?: number;
  };
}

export const Dashboard = () => {
  const [repos, setRepos] = useState<RepoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const pageSize = 9;

  const fetchDashboard = async (username: string, nextPage: number) => {
    setLoading(true);
    try {
      const [repoData, statsData] = await Promise.all([
        reposApi.list(username, nextPage, pageSize) as Promise<RepoListResponse>,
        reposApi.getStatsMy() as Promise<StatsData>,
      ]);

      const baseRepos = repoData.repos ?? [];
      const repoCounts = await Promise.allSettled(
        baseRepos.map(async (repo) => {
          const commitData = (await reposApi.getCommits(username, repo.name, 1, 1)) as RepoCommitsResponse;
          return {
            repoName: repo.name,
            commitCount: commitData.pagination?.total ?? commitData.commits?.length ?? 0,
          };
        }),
      );

      const reposWithCounts = baseRepos.map((repo) => {
        const match = repoCounts.find(
          (result) => result.status === 'fulfilled' && result.value.repoName === repo.name,
        );

        return {
          ...repo,
          commit_count: match?.status === 'fulfilled' ? match.value.commitCount : 0,
        };
      });

      setRepos(reposWithCounts);
      setStats(statsData);
      setPagination(repoData.pagination ?? null);
      setPage(nextPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    void fetchDashboard(user.username, page);
  }, [navigate, user]);

  const filteredRepos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return repos;
    }

    return repos.filter((repo) => repo.name.toLowerCase().includes(query));
  }, [repos, search]);

  if (!user) {
    return null;
  }

  const visibleRepos = search.trim() ? filteredRepos : repos;
  const handlePageChange = (nextPage: number) => {
    if (!user || !pagination || nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) {
      return;
    }

    void fetchDashboard(user.username, nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto flex max-w-[1400px]">
      <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[220px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-surface)] px-4 py-6 lg:block">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[18px] font-semibold text-[var(--accent)]">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[16px] font-semibold text-[var(--text-primary)]">{user.username}</div>
            <div className="truncate text-[13px] text-[var(--text-muted)]">{user.email}</div>
          </div>
        </div>

        <hr className="divider my-4" />

        <div className="flex gap-3 text-[13px] text-[var(--text-muted)]">
          <span>{stats?.repos ?? repos.length} repos</span>
          <span>{stats?.commits ?? 0} commits</span>
        </div>

        <hr className="divider my-4" />

        <div className="space-y-1">
          {['Repos', 'Starred', 'Settings'].map((item, index) => {
            const active = index === 0;
            return (
              <div
                key={item}
                className="rounded-[var(--radius-md)] border-l-2 px-3 py-2 text-[14px]"
                style={{
                  borderLeftColor: active ? 'var(--accent)' : 'transparent',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Your Repositories</h1>
            <button type="button" className="btn btn-primary self-start sm:self-auto" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              New Repository
            </button>
          </div>

          <div className="mb-6">
            <input
              className="input w-full max-w-[280px]"
              placeholder="Search repositories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading ? (
            <div className="py-16 text-[14px] text-[var(--text-muted)]">Loading repositories...</div>
          ) : visibleRepos.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <GitFork size={48} className="mb-4 text-[var(--text-muted)]" />
              <h2 className="mb-2 text-[18px] font-semibold text-[var(--text-primary)]">No repositories yet</h2>
              <p className="mb-5 text-[14px] text-[var(--text-muted)]">Create your first repo to get started.</p>
              <button type="button" className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                New Repository
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {visibleRepos.map((repo, index) => (
                  <Link
                    key={repo.id ?? repo.name}
                    to={`/${user.username}/${repo.name}`}
                    className={`card card-hover animate-fade-up block ${getStaggerClass(index)}`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <h2 className="font-display truncate text-[17px] text-[var(--text-primary)]">{repo.name}</h2>
                        {repo.is_private ? <span className="badge badge-private">Private</span> : null}
                      </div>
                      <ArrowUpRight size={16} className="text-[var(--text-muted)]" />
                    </div>

                    <p className="mb-4 truncate text-[13px] text-[var(--text-secondary)]">
                      {repo.description || 'No description provided yet.'}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-[var(--text-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <GitBranch size={13} />
                        main
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitCommit size={13} />
                        {repo.commit_count ?? 0} commits
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={13} />
                        Updated {formatRelativeTime(repo.updated_at || repo.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {!search.trim() && pagination && pagination.totalPages > 1 ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[13px] text-[var(--text-muted)]">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft size={14} />
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!pagination.hasMore}
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>

      <CreateRepoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          void fetchDashboard(user.username, 1);
        }}
      />
    </div>
  );
};
