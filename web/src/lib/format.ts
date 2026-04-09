export const formatRelativeTime = (value?: string | null) => {
  if (!value) {
    return 'recently';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'recently';
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}y ago`;
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return 'Unknown date';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const getStaggerClass = (index: number) => `stagger-${(index % 5) + 1}`;
