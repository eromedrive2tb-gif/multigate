/** @jsxImportSource hono/jsx */

interface BadgeProps {
    children: any;
    variant?: 'success' | 'warning' | 'info';
    className?: string;
}

export const Badge = ({ children, variant = 'success', className = '' }: BadgeProps) => {
    const variantClass = `badge-${variant}`;
    return (
        <span class={`badge ${variantClass} ${className}`}>
            {children}
        </span>
    );
};
