/** @jsxImportSource hono/jsx */
import { Heading } from "../atoms/Heading";
import { Icon } from "../atoms/Icon";
import { Button } from "../atoms/Button";

interface HeaderProps {
    onLogout?: string;
}

export const Header = ({ onLogout = "logout()" }: HeaderProps) => {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
                <Heading level={1} style={{ fontSize: '2rem', marginBottom: '0.25rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    MultiGate Aggregate
                </Heading>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Manage your payment infrastructure across multiple providers.
                </p>
            </div>
            <Button
                variant="danger"
                hx-post="/auth/logout"
                hx-trigger="click"
                hx-on--after-request="window.location.href = '/login'"
            >
                <Icon name="log-out" />
                Logout
            </Button>
        </header>
    );
};
