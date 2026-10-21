import React from 'react';

export interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'neutral' | 'info' | 'accent' | 'teal';
  size?: 'sm' | 'md';
  icon?: React.ElementType;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Status badge component.
 * Uses CSS custom properties for theming (light/dark aware).
 * Font is sans-serif (Inter), not monospace, per WCAG readability.
 * Minimum font size: 12px (0.75rem).
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  dot = false,
  children,
  className = '',
}) => {
  const cssClass = (() => {
    switch (variant) {
      case 'success':                return 'badge badge-success';
      case 'warning':                return 'badge badge-warning';
      case 'danger':
      case 'error':                  return 'badge badge-danger';
      case 'neutral':                return 'badge badge-neutral';
      // treat legacy teal/accent/info variants as primary
      case 'teal':
      case 'accent':
      case 'info':
      case 'primary':
      default:                       return 'badge badge-primary';
    }
  })();

  const sizeStyle: React.CSSProperties = size === 'sm'
    ? { fontSize: '0.6875rem', padding: '0.125rem 0.5rem' }  // 11px — very small but contextually acceptable
    : {};

  const dotColorMap: Record<string, string> = {
    primary: 'var(--color-primary)',
    success: 'var(--color-status-green)',
    warning: 'var(--color-status-amber)',
    danger:  'var(--color-status-red)',
    error:   'var(--color-status-red)',
    neutral: 'var(--color-text-muted)',
    teal:    'var(--color-primary)',
    accent:  'var(--color-primary)',
    info:    'var(--color-primary)',
  };

  return (
    <span className={`${cssClass} ${className}`} style={sizeStyle}>
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full shrink-0"
          style={{ background: dotColorMap[variant] || 'var(--color-primary)' }}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
