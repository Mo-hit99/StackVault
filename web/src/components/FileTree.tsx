import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';

type TreeNode = {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
};

export interface FileTreeProps {
  snapshot: Record<string, string>;
  selectedPath?: string | null;
  onSelect: (path: string) => void;
}

const sortTree = (nodes: TreeNode[]): TreeNode[] =>
  nodes
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    })
    .map((node) => ({
      ...node,
      children: node.children ? sortTree(node.children) : undefined,
    }));

const buildTree = (paths: string[]): TreeNode[] => {
  const root: TreeNode[] = [];

  for (const fullPath of paths) {
    const parts = fullPath.split('/').filter(Boolean);
    let current = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;
      let existing = current.find((item) => item.name === part);

      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
        current.push(existing);
      }

      if (!isFile) {
        existing.children ??= [];
        current = existing.children;
      }
    });
  }

  return sortTree(root);
};

const getFileMeta = (name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'js':
    case 'jsx':
      return { Icon: FileCode, color: 'var(--yellow)' };
    case 'ts':
    case 'tsx':
    case 'py':
      return { Icon: FileCode, color: 'var(--blue)' };
    case 'json':
      return { Icon: FileJson, color: 'var(--green)' };
    case 'css':
      return { Icon: FileCode, color: 'var(--purple)' };
    case 'md':
      return { Icon: FileText, color: 'var(--text-muted)' };
    default:
      return { Icon: File, color: 'var(--text-muted)' };
  }
};

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  expandedFolders: Set<string>;
  selectedPath?: string | null;
  toggleFolder: (path: string) => void;
  onSelect: (path: string) => void;
}

const TreeItem = ({ node, depth, expandedFolders, selectedPath, toggleFolder, onSelect }: TreeItemProps) => {
  const isFolder = node.type === 'folder';
  const isOpen = expandedFolders.has(node.path);
  const isActive = selectedPath === node.path;
  const paddingLeft = 8 + depth * 16;

  if (isFolder) {
    return (
      <div>
        <button
          type="button"
          onClick={() => toggleFolder(node.path)}
          className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2 py-[5px] text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]"
          style={{ paddingLeft }}
        >
          <ChevronRight
            size={14}
            className={`shrink-0 text-[var(--text-muted)] ${isOpen ? 'rotate-90' : ''}`}
            style={{ transition: 'transform 200ms ease' }}
          />
          {isOpen ? (
            <FolderOpen size={15} style={{ color: 'var(--yellow)' }} />
          ) : (
            <Folder size={15} style={{ color: 'var(--yellow)' }} />
          )}
          <span className="truncate font-medium">{node.name}</span>
        </button>

        {isOpen && (
          <div>
            {node.children?.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                expandedFolders={expandedFolders}
                selectedPath={selectedPath}
                toggleFolder={toggleFolder}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const { Icon, color } = getFileMeta(node.name);

  return (
    <button
      type="button"
      onClick={() => onSelect(node.path)}
      className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border-l-2 px-2 py-[5px] text-left text-[13px] hover:bg-[var(--bg-overlay)]"
      style={{
        paddingLeft,
        borderLeftColor: isActive ? 'var(--accent)' : 'transparent',
        background: isActive ? 'var(--accent-soft)' : 'transparent',
        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
      }}
    >
      <Icon size={15} style={{ color }} />
      <span className="truncate">{node.name}</span>
    </button>
  );
};

export const FileTree = ({ snapshot, selectedPath, onSelect }: FileTreeProps) => {
  const files = useMemo(
    () =>
      Object.keys(snapshot)
        .filter((path) => !path.startsWith('.git/') && path !== '.git')
        .sort(),
    [snapshot],
  );
  const tree = useMemo(() => buildTree(files), [files]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!selectedPath) {
      return;
    }

    const segments = selectedPath.split('/');
    const folders = new Set<string>();

    for (let index = 1; index < segments.length; index += 1) {
      folders.add(segments.slice(0, index).join('/'));
    }

    setExpandedFolders((current) => new Set([...current, ...folders]));
  }, [selectedPath]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <aside
      className="h-[calc(100vh-120px)] overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-3"
      style={{ top: '120px' }}
    >
      <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        Files
      </div>

      {tree.length === 0 ? (
        <div className="px-3 py-6 text-[13px] text-[var(--text-muted)]">No files in this snapshot.</div>
      ) : (
        tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            depth={0}
            expandedFolders={expandedFolders}
            selectedPath={selectedPath}
            toggleFolder={toggleFolder}
            onSelect={onSelect}
          />
        ))
      )}
    </aside>
  );
};
