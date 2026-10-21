import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div className="h-32 w-full rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 flex flex-col justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-3 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
