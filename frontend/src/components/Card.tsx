import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Base card component.
 * Uses CSS custom properties for theme awareness.
 * Interactive hover uses a subtle border highlight — no neon glow.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, className = '', children, style, ...props }, ref) => (
    <div
      ref={ref}
      className={`sva-card ${interactive ? 'sva-card-interactive cursor-pointer' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3
    className={`text-lg font-semibold ${className}`}
    style={{ color: 'var(--color-text-primary)' }}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p
    className={`text-sm leading-relaxed ${className}`}
    style={{ color: 'var(--color-text-muted)' }}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={`mt-4 pt-4 flex items-center justify-between ${className}`}
    style={{ borderTop: '1px solid var(--color-border)' }}
    {...props}
  >
    {children}
  </div>
);

export default Card;
