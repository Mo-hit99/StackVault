import { CheckCheck, ChevronRight, Clipboard, Code } from 'lucide-react';
import { useMemo, useState } from 'react';

interface CodeViewerProps {
  content?: string;
  filename?: string;
}

export const CodeViewer = ({ content = '', filename = '' }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => content.split('\n'), [content]);
  const pathParts = filename.split('/').filter(Boolean);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (!filename) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-6 py-16 text-center text-[15px] text-[var(--text-muted)]">
        Select a file to view its contents
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--bg-surface)]">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 text-[13px]">
          {pathParts.map((part, index) => (
            <div key={`${part}-${index}`} className="flex items-center gap-1">
              <span className={index === pathParts.length - 1 ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
                {part}
              </span>
              {index < pathParts.length - 1 && <ChevronRight size={13} className="text-[var(--text-muted)]" />}
            </div>
          ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleCopy}>
            {copied ? <CheckCheck size={14} /> : <Clipboard size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm">
            <Code size={14} />
            Raw
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-auto bg-[var(--bg-surface)]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-[var(--bg-elevated)]">
                <td className="w-10 min-w-[40px] select-none border-r border-[var(--border)] px-2 pb-0 pt-[2px] text-right align-top font-mono text-[11px] text-[var(--text-muted)] sm:w-12 sm:min-w-[48px] sm:px-4 sm:text-[12px]">
                  {index + 1}
                </td>
                <td className="px-3 py-0 font-mono text-[12px] leading-[1.7] text-[var(--text-primary)] whitespace-pre sm:px-4 sm:text-[13px]">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
