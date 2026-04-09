import { ArrowLeft, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { CodeViewer } from '../components/CodeViewer';

interface BlobResponse {
  content: string;
}

export const FileView = () => {
  const { username = '', repo = '' } = useParams();
  const location = useLocation();
  const filepath = new URLSearchParams(location.search).get('filepath');
  const [blob, setBlob] = useState<BlobResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlob = async () => {
      if (!filepath) {
        setLoading(false);
        return;
      }

      try {
        const data = (await api.get(`/repos/${username}/${repo}/blob?filepath=${encodeURIComponent(filepath)}`)) as BlobResponse;
        setBlob(data);
      } catch (error) {
        console.error(error);
        setBlob(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchBlob();
  }, [filepath, repo, username]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-center gap-3">
        <Link to={`/${username}/${repo}`} className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} />
          Back
        </Link>
        <div>
          <div className="text-[13px] text-[var(--text-muted)]">
            {username} / {repo}
          </div>
          <h1 className="mt-1 font-mono text-[16px] text-[var(--text-primary)]">{filepath ?? 'Unknown file'}</h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)]">
        {loading ? (
          <div className="p-6 text-[14px] text-[var(--text-muted)]">Loading file...</div>
        ) : blob && filepath ? (
          <CodeViewer content={blob.content} filename={filepath} />
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <FileText size={44} className="mb-4 text-[var(--text-muted)]" />
            <h2 className="mb-2 text-[18px] font-semibold text-[var(--text-primary)]">File not found</h2>
            <p className="text-[14px] text-[var(--text-muted)]">This file is not available in the selected snapshot.</p>
          </div>
        )}
      </div>
    </div>
  );
};
