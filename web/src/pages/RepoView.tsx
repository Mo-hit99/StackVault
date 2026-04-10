import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ChevronDown, Copy, GitBranch, GitCommit, Globe, Lock } from 'lucide-react';
import { api, reposApi } from '../api/client';
import { CodeViewer } from '../components/CodeViewer';
import { FileTree } from '../components/FileTree';
import { RepoSettingsModal } from '../components/RepoSettingsModal';
import { useAuthStore } from '../store/authStore';

interface RepoData {
  name: string;
  description?: string | null;
  is_private?: boolean;
  created_at?: string;
}

interface CommitRecord {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  snapshot: Record<string, string>;
}

interface CommitResponse {
  commits?: CommitRecord[];
}

interface BlobResponse {
  content: string;
}

export const RepoView = () => {
  const { username = '', repo = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [commits, setCommits] = useState<CommitRecord[]>([]);
  const [snapshot, setSnapshot] = useState<Record<string, string>>({});
  const [blob, setBlob] = useState<BlobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [blobLoading, setBlobLoading] = useState(false);
  const [showClone, setShowClone] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileFiles, setShowMobileFiles] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const selectedPath = searchParams.get('path');

  const filePaths = useMemo(() => Object.keys(snapshot).sort(), [snapshot]);
  const readmePath = useMemo(
    () => ['README.md', 'readme.md', 'Readme.md'].find((file) => filePaths.includes(file)) ?? null,
    [filePaths],
  );
  const cloneUrl = `${window.location.origin}/${username}/${repo}.git`;

  useEffect(() => {
    const fetchRepo = async () => {
      setLoading(true);
      try {
        const [repoDetails, commitData] = await Promise.all([
          reposApi.get(username, repo) as Promise<RepoData>,
          reposApi.getCommits(username, repo, 1, 20) as Promise<CommitResponse>,
        ]);

        setRepoData(repoDetails);
        const nextCommits = commitData.commits ?? [];
        setCommits(nextCommits);
        setSnapshot(nextCommits[0]?.snapshot ?? {});
      } catch (error) {
        console.error(error);
        setRepoData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchRepo();
  }, [repo, username]);

  useEffect(() => {
    if (!selectedPath && readmePath) {
      setSearchParams({ path: readmePath }, { replace: true });
    }
  }, [readmePath, selectedPath, setSearchParams]);

  useEffect(() => {
    const fetchBlob = async () => {
      if (!selectedPath) {
        setBlob(null);
        return;
      }

      setBlobLoading(true);
      try {
        const response = (await api.get(`/repos/${username}/${repo}/blob?filepath=${encodeURIComponent(selectedPath)}`)) as BlobResponse;
        setBlob(response);
      } catch (error) {
        console.error(error);
        setBlob(null);
      } finally {
        setBlobLoading(false);
      }
    };

    void fetchBlob();
  }, [repo, selectedPath, username]);

  useEffect(() => {
    setShowMobileFiles(false);
  }, [selectedPath]);

  if (loading) {
    return <div className="px-4 py-16 text-[14px] text-[var(--text-muted)] sm:px-6">Loading repository...</div>;
  }

  if (!repoData) {
    return (
      <div className="px-6 py-16">
        <div className="card mx-auto max-w-[520px] text-center">
          <h1 className="mb-2 text-[22px] font-semibold text-[var(--text-primary)]">Repository not found</h1>
          <p className="text-[14px] text-[var(--text-muted)]">This repository may be private or no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-[13px] sm:text-[14px]">
            <span className="break-all text-[var(--text-muted)]">{username}</span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="break-all font-display text-[17px] text-[var(--text-primary)]">{repoData.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <GitBranch size={14} />
              main
            </span>
            <Link to={`/${username}/${repo}/commits`} className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]">
              <GitCommit size={14} />
              {commits.length} commits
            </Link>
            <span className="inline-flex items-center gap-1">
              {repoData.is_private ? <Lock size={14} /> : <Globe size={14} />}
              {repoData.is_private ? 'Private' : 'Public'}
            </span>
            <div className="relative">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowClone((value) => !value)}>
                <Copy size={14} />
                Clone
              </button>
              {showClone ? (
                <div className="absolute left-0 top-full z-10 mt-2 w-[min(280px,calc(100vw-2rem))] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-surface)] p-3 text-[12px] text-[var(--text-secondary)] shadow-[var(--shadow-md)]">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)]">Clone URL</div>
                  <div className="font-mono break-all text-[var(--text-primary)]">{cloneUrl}</div>
                </div>
              ) : null}
            </div>
            {authUser?.username === username ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowSettings(true)}>
                Settings
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] min-w-0 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="border-b border-[var(--border)] bg-[var(--bg-elevated)] lg:hidden">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]"
            onClick={() => setShowMobileFiles((current) => !current)}
            aria-expanded={showMobileFiles}
          >
            <span>Files</span>
            <ChevronDown size={16} className={showMobileFiles ? 'rotate-180' : ''} />
          </button>
          {showMobileFiles ? (
            <FileTree
              snapshot={snapshot}
              selectedPath={selectedPath}
              onSelect={(path) => setSearchParams({ path })}
              className="max-h-[50vh] border-t border-[var(--border)]"
            />
          ) : null}
        </div>

        <div className="sticky top-[120px] hidden lg:block">
          <FileTree
            snapshot={snapshot}
            selectedPath={selectedPath}
            onSelect={(path) => setSearchParams({ path })}
            className="h-[calc(100vh-120px)] border-r border-[var(--border)]"
          />
        </div>

        <section className="min-w-0 bg-[var(--bg-surface)]">
          {!selectedPath ? (
            <div className="p-4 sm:p-6">
              <div className="mb-0 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[13px] font-semibold text-[var(--text-primary)]">
                README.md
              </div>
              <div className="overflow-x-auto p-4 text-[14px] leading-[1.7] text-[var(--text-secondary)] sm:text-[15px]">
                {readmePath ? snapshot[readmePath] : 'No README available for this repository yet.'}
              </div>
            </div>
          ) : blobLoading ? (
            <div className="p-4 text-[14px] text-[var(--text-muted)] sm:p-6">Loading file...</div>
          ) : (
            <CodeViewer content={blob?.content ?? ''} filename={selectedPath} />
          )}
        </section>
      </div>

      <RepoSettingsModal
        repo={repoData}
        username={username}
        reponame={repo}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};
