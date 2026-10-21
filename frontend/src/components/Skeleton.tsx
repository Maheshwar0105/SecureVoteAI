import React from 'react';

interface SkeletonProps {
  className?: string;
  /** Override height via inline style if needed */
  style?: React.CSSProperties;
}

/** Single animated skeleton block */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => (
  <div className={`sva-skeleton ${className}`} style={style} aria-hidden="true" />
);

/** Skeleton for a card with heading + 2 lines of body */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`rounded-xl p-5 border ${className}`}
    style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
    aria-hidden="true"
  >
    <Skeleton className="h-4 w-32 mb-3" />
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1.5" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

/** Skeleton for a table row */
export const SkeletonRow: React.FC<{ cols?: number }> = ({ cols = 4 }) => (
  <div className="flex items-center gap-4 py-3" aria-hidden="true">
    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
    {Array.from({ length: cols - 1 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4 flex-1"
        style={{ maxWidth: i === 0 ? '160px' : '100%' }}
      />
    ))}
  </div>
);

/** Full dashboard skeleton */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 w-full animate-fade-in" aria-label="Loading dashboard…" role="status">
    {/* Header card */}
    <div
      className="rounded-xl p-6 border"
      style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
    >
      <Skeleton className="h-3 w-40 mb-3" />
      <Skeleton className="h-8 w-2/3 mb-2" />
      <Skeleton className="h-4 w-80" />
    </div>

    {/* Grid of 3 stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>

    {/* Table */}
    <div
      className="rounded-xl p-5 border"
      style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }}
    >
      <Skeleton className="h-5 w-48 mb-4" />
      <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {[1, 2, 3, 4].map((n) => <SkeletonRow key={n} />)}
      </div>
    </div>
  </div>
);

/** Empty state component */
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    {icon && (
      <div
        className="flex items-center justify-center h-14 w-14 rounded-2xl mb-4"
        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
      >
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
      {title}
    </h3>
    {description && (
      <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
        {description}
      </p>
    )}
    {action}
  </div>
);

export default Skeleton;
