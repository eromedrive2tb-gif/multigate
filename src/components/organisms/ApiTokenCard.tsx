/** @jsxImportSource hono/jsx */
import { CardHeader } from "../molecules/CardHeader";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";

interface ApiTokenCardProps {
    token: string;
}

export const ApiTokenCard = ({ token }: ApiTokenCardProps) => {
    return (
        <div class="glass-card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))' }}>
            <CardHeader title="API Aggregator Token">
                <Button variant="outline" onClick="copyToken()">
                    <Icon name="copy" />
                    Copy
                </Button>
                <Button
                    hx-post="/dashboard/regenerate-token"
                    hx-target="#apiTokenDisplay"
                    hx-swap="innerHTML"
                    hx-confirm="Are you sure you want to regenerate your API token? The old one will stop working immediately."
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                    <Icon name="refresh-cw" />
                    Regenerate
                </Button>
            </CardHeader>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '-1rem', marginBottom: '1.5rem' }}>
                Use this bearer token to authenticate requests to the unified endpoint.
            </p>

            <div id="apiTokenDisplay" style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                border: '1px solid var(--border)',
                wordBreak: 'break-all',
                color: 'var(--accent-primary)'
            }}>
                {token}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <Icon name="terminal" style={{ width: '14px', height: '14px' }} />
                <span>Endpoint: </span>
                <code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>POST /api/unified/charge</code>
            </div>
        </div>
    );
};
