import { Calendar, ChevronLeft, ChevronRight, GitBranch, GitCommit, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { reposApi } from '../api/client';
import { formatDateTime, getStaggerClass } from '../lib/format';

interface CommitRecord {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

interface CommitResponse {
  commits?: CommitRecord[];
  pagination?: {
    page: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const CommitLog = () => {
  const { username = '', repo = '' } = useParams();
  const [commits, setCommits] = useState<CommitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<CommitResponse['pagination'] | null>(null);
  const pageSize = 12;

  const fetchCommits = async (nextPage: number) => {
    setLoading(true);
    try {
      const data = (await reposApi.getCommits(username, repo, nextPage, pageSize)) as CommitResponse;
      setCommits(data.commits ?? []);
      setPagination(data.pagination ?? null);
      setPage(nextPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCommits(1);
  }, [repo, username]);

  const handlePageChange = (nextPage: number) => {
    if (!pagination || nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) {
      return;
    }

    void fetchCommits(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-[760px] px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--text-primary)]">Commit History</h1>
          <div className="mt-1 text-[14px] text-[var(--text-muted)]">
            {username} / {repo} / commits
          </div>
        </div>
        <span className="badge badge-branch self-start">
          <GitBranch size={12} />
          main
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-[14px] text-[var(--text-muted)]">Loading commits...</div>
      ) : commits.length === 0 ? (
        <div className="card text-center">
          <GitCommit size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
          <h2 className="mb-2 text-[18px] font-semibold text-[var(--text-primary)]">No commits yet</h2>
          <p className="text-[14px] text-[var(--text-muted)]">Push your first commit to start the timeline.</p>
        </div>
      ) : (
        <div className="relative pl-0 before:absolute before:bottom-0 before:left-[15px] before:top-0 before:border-l-2 before:border-dashed before:border-[var(--border-strong)] before:content-['']">
          {commits.map((commit, index) => {
            const isHead = index === 0;
            return (
              <div key={commit.id} className="relative mb-1 flex gap-5">
                <div
                  className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-[var(--bg-surface)]"
                  style={{ borderColor: isHead ? 'var(--accent)' : 'var(--border-strong)' }}
                >
                  <GitCommit size={14} style={{ color: isHead ? 'var(--accent)' : 'var(--text-muted)' }} />
                </div>

                <div className={`animate-fade-up ${getStaggerClass(index)} flex-1 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 hover:shadow-[var(--shadow-sm)]`}>
                  <div className="text-[15px] font-medium text-[var(--text-primary)]">{commit.message}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[var(--text-muted)]">
                    <span className="commit-hash">{commit.id.slice(0, 8)}</span>
                    <span className="inline-flex items-center gap-1">
                      <User size={12} />
                      {commit.author || 'system'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDateTime(commit.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to={`/${username}/${repo}`} className="btn btn-secondary btn-sm">
            Back to Repository
          </Link>

          {pagination && pagination.totalPages > 1 ? (
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
              <span className="px-2 text-[13px] text-[var(--text-muted)]">
                Page {pagination.page} of {pagination.totalPages}
              </span>
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
          ) : null}
        </div>
      </div>
    </div>
  );
};
