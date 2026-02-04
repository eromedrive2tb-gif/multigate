/** @jsxImportSource hono/jsx */
import { Heading } from "../atoms/Heading";
import { Badge } from "../atoms/Badge";

interface CardHeaderProps {
    title: string;
    badgeText?: string;
    badgeVariant?: 'success' | 'warning' | 'info';
    children?: any;
}

export const CardHeader = ({ title, badgeText, badgeVariant = 'success', children }: CardHeaderProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: children ? '1.5rem' : '1rem' }}>
            <Heading level={3} style={{ fontSize: '1.1rem' }}>{title}</Heading>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
                {children}
            </div>
        </div>
    );
};
