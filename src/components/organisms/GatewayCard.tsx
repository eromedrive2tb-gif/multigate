/** @jsxImportSource hono/jsx */
import { CardHeader } from "../molecules/CardHeader";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";

interface Gateway {
    id: number;
    name: string;
    type: string;
    credentials_json: string;
    is_active: boolean;
}

interface GatewayCardProps {
    gateway: Gateway;
}

export const GatewayCard = ({ gateway }: GatewayCardProps) => {
    let creds: any = {};
    try {
        creds = JSON.parse(gateway.credentials_json);
    } catch (e) { }

    return (
        <div class="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CardHeader title={gateway.name} badgeText="Active" />

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <p><strong>Provider Type:</strong> {gateway.type}</p>
            </div>

            <div style={{ height: '1px', background: 'var(--border)' }}></div>

            <div
                id={`gateway-form-${gateway.id}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
                <form
                    hx-put={`/api/gateway/${gateway.id}`}
                    hx-ext="json-enc"
                    hx-on--after-request="if(event.detail.successful) alert('Credentials updated successfully!')"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                >
                    {gateway.type === 'openpix' && (
                        <>
                            <FormField label="App ID" id={`openpix-appId-${gateway.id}`} name="credentials.appId" value={creds.appId} />
                        </>
                    )}

                    {gateway.type === 'junglepay' && (
                        <>
                            <FormField label="Public Key" id={`junglepay-publicKey-${gateway.id}`} name="credentials.junglePublicKey" value={creds.junglePublicKey} />
                            <FormField label="Secret Key" id={`junglepay-secretKey-${gateway.id}`} name="credentials.jungleSecretKey" value={creds.jungleSecretKey} type="password" />
                        </>
                    )}

                    {gateway.type === 'diasmarketplace' && (
                        <>
                            <FormField label="API Key" id={`dias-apiKey-${gateway.id}`} name="credentials.diasApiKey" value={creds.diasApiKey} />
                            <FormField label="Withdrawal Token" id={`dias-withdrawal-${gateway.id}`} name="credentials.withdrawalToken" value={creds.withdrawalToken} type="password" />
                        </>
                    )}

                    <Button type="submit" variant="outline" style={{ marginTop: '0.5rem', width: '100%' }}>
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};
