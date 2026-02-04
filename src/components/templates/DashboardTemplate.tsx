/** @jsxImportSource hono/jsx */
import { Layout } from "../Layout";
import { Heading } from "../atoms/Heading";
import { Badge } from "../atoms/Badge";

interface DashboardTemplateProps {
    header: any;
    tokenCard: any;
    gatewayCount: number;
    gatewayCards: any[];
    addGatewayCards: any[];
    scripts: any;
}

export const DashboardTemplate = ({
    header,
    tokenCard,
    gatewayCount,
    gatewayCards,
    addGatewayCards,
    scripts
}: DashboardTemplateProps) => {
    return (
        <Layout title="MultiGate Dashboard">
            {header}

            {tokenCard}

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading level={2} style={{ fontSize: '1.5rem' }}>Connected Gateways</Heading>
                <Badge variant="success">{gatewayCount} Active</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {gatewayCards}
                {addGatewayCards}
            </div>

            {scripts}
        </Layout>
    );
};
