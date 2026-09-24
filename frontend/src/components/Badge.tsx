import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'accent' | 'teal' | 'success' | 'warning' | 'danger' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ElementType;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  dot = false,
  children,
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
    accent: 'bg-teal-950/80 border-teal-500/40 text-teal-300',
    teal: 'bg-teal-950/80 border-teal-500/40 text-teal-300',
    success: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
    warning: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
    danger: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
    error: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
    info: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
    neutral: 'bg-slate-900/80 border-slate-700/60 text-slate-300'
  };

  const dotColors = {
    primary: 'bg-purple-400',
    accent: 'bg-teal-400',
    teal: 'bg-teal-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    error: 'bg-rose-400',
    info: 'bg-cyan-400',
    neutral: 'bg-slate-400'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-semibold border backdrop-blur-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {Icon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
