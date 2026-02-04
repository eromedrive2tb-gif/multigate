/** @jsxImportSource hono/jsx */

import { Layout } from "./Layout";

interface Gateway {
    id: number;
    name: string;
    type: string;
    credentials_json: string;
    is_active: boolean;
}

interface DashboardProps {
    user: any;
    gateways: Gateway[];
    configuredTypes: string[];
    aggregatorToken: string;
}

export const Dashboard = ({ user, gateways, configuredTypes, aggregatorToken }: DashboardProps) => {
    return (
        <Layout title="MultiGate Dashboard">
            <header>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        MultiGate Aggregate
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Manage your payment infrastructure across multiple providers.
                    </p>
                </div>
                <button class="btn btn-danger" onclick="logout()">
                    <i data-lucide="log-out" style={{ width: '16px', height: '16px' }}></i>
                    Logout
                </button>
            </header>

            <div class="glass-card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>API Aggregator Token</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Use this bearer token to authenticate requests to the unified endpoint.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button class="btn btn-outline" onclick="copyToken()">
                            <i data-lucide="copy" style={{ width: '16px', height: '16px' }}></i>
                            Copy
                        </button>
                        <button class="btn btn-primary" onclick="regenerateToken()" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            <i data-lucide="refresh-cw" style={{ width: '16px', height: '16px' }}></i>
                            Regenerate
                        </button>
                    </div>
                </div>

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
                    {aggregatorToken}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <i data-lucide="terminal" style={{ width: '14px', height: '14px' }}></i>
                    <span>Endpoint: </span>
                    <code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>POST /api/unified/charge</code>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Connected Gateways</h2>
                <span class="badge badge-success">{gateways.length} Active</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {gateways.map((gateway) => {
                    let creds: any = {};
                    try {
                        creds = JSON.parse(gateway.credentials_json);
                    } catch (e) { }

                    return (
                        <div class="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem' }}>{gateway.name}</h3>
                                <span class="badge badge-success">Active</span>
                            </div>

                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <p><strong>Provider Type:</strong> {gateway.type}</p>
                            </div>

                            <div style={{ height: '1px', background: 'var(--border)' }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {gateway.type === 'openpix' && (
                                    <>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>App ID</label>
                                            <input type="text" id={`openpix-appId-${gateway.id}`} value={creds.appId} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>API Key</label>
                                            <input type="password" id={`openpix-apiKey-${gateway.id}`} value={creds.apiKey} />
                                        </div>
                                    </>
                                )}

                                {gateway.type === 'junglepay' && (
                                    <>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Public Key</label>
                                            <input type="text" id={`junglepay-publicKey-${gateway.id}`} value={creds.junglePublicKey} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Secret Key</label>
                                            <input type="password" id={`junglepay-secretKey-${gateway.id}`} value={creds.jungleSecretKey} />
                                        </div>
                                    </>
                                )}

                                {gateway.type === 'diasmarketplace' && (
                                    <>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>API Key</label>
                                            <input type="text" id={`dias-apiKey-${gateway.id}`} value={creds.diasApiKey} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Withdrawal Token</label>
                                            <input type="password" id={`dias-withdrawal-${gateway.id}`} value={creds.withdrawalToken} />
                                        </div>
                                    </>
                                )}

                                <button class="btn btn-outline" style={{ marginTop: '0.5rem', width: '100%' }} onclick={`saveCredentials('${gateway.type}', ${gateway.id})`}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Gateways */}
                {!configuredTypes.includes('openpix') && (
                    <div class="glass-card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add OpenPix / Woovi</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input type="text" id="new-openpix-appId" placeholder="App ID" />
                            <input type="password" id="new-openpix-apiKey" placeholder="API Key" />
                            <button class="btn btn-primary" onclick="saveNewGateway('openpix')">
                                <i data-lucide="plus" style={{ width: '16px', height: '16px' }}></i>
                                Configure
                            </button>
                        </div>
                    </div>
                )}

                {!configuredTypes.includes('junglepay') && (
                    <div class="glass-card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add JunglePay</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input type="text" id="new-junglepay-publicKey" placeholder="Public Key" />
                            <input type="password" id="new-junglepay-secretKey" placeholder="Secret Key" />
                            <button class="btn btn-primary" onclick="saveNewGateway('junglepay')">
                                <i data-lucide="plus" style={{ width: '16px', height: '16px' }}></i>
                                Configure
                            </button>
                        </div>
                    </div>
                )}

                {!configuredTypes.includes('diasmarketplace') && (
                    <div class="glass-card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add Dias Marketplace</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <input type="text" id="new-dias-apiKey" placeholder="API Key" />
                            <input type="password" id="new-dias-withdrawal" placeholder="Withdrawal Token" />
                            <button class="btn btn-primary" onclick="saveNewGateway('diasmarketplace')">
                                <i data-lucide="plus" style={{ width: '16px', height: '16px' }}></i>
                                Configure
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
          function logout() {
            fetch('/auth/logout', { 
              method: 'POST',
              credentials: 'same-origin'
            })
            .then(() => window.location.href = '/login');
          }
          
          function copyToken() {
            const tokenElement = document.getElementById('apiTokenDisplay');
            navigator.clipboard.writeText(tokenElement.textContent).then(() => {
              alert('API Token copied to clipboard!');
            });
          }
          
          async function regenerateToken() {
            if (!confirm('Are you sure you want to regenerate your API token? The old one will stop working immediately.')) {
              return;
            }
            
            try {
              const response = await fetch('/dashboard/regenerate-token', { 
                method: 'POST',
              });
              
              if (response.ok) {
                const data = await response.json();
                document.getElementById('apiTokenDisplay').textContent = data.token;
                alert('API Token regenerated successfully!');
                window.location.reload();
              } else {
                alert('Error regenerating token');
              }
            } catch (error) {
              alert('Error connecting to server');
            }
          }
          
          async function saveCredentials(gatewayType, gatewayId) {
            let credentials = {};
            
            if (gatewayType === 'openpix') {
              credentials = {
                appId: document.getElementById('openpix-appId-' + gatewayId).value,
                apiKey: document.getElementById('openpix-apiKey-' + gatewayId).value
              };
            } else if (gatewayType === 'junglepay') {
              credentials = {
                junglePublicKey: document.getElementById('junglepay-publicKey-' + gatewayId).value,
                jungleSecretKey: document.getElementById('junglepay-secretKey-' + gatewayId).value
              };
            } else if (gatewayType === 'diasmarketplace') {
              credentials = {
                diasApiKey: document.getElementById('dias-apiKey-' + gatewayId).value,
                withdrawalToken: document.getElementById('dias-withdrawal-' + gatewayId).value
              };
            }
            
            try {
              const response = await fetch('/api/gateway/' + gatewayId, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credentials })
              });
              
              const result = await response.json();
              
              if (response.ok) {
                alert('Credentials updated successfully!');
              } else {
                alert('Error saving credentials: ' + (result.error || 'Unknown error'));
              }
            } catch (error) {
              alert('Error connecting to server: ' + error.message);
            }
          }
          
          async function saveNewGateway(gatewayType) {
            let credentials = {};
            let gatewayName = '';
            
            if (gatewayType === 'openpix') {
              credentials = {
                appId: document.getElementById('new-openpix-appId').value,
                apiKey: document.getElementById('new-openpix-apiKey').value
              };
              gatewayName = 'OpenPix Gateway';
            } else if (gatewayType === 'junglepay') {
              credentials = {
                junglePublicKey: document.getElementById('new-junglepay-publicKey').value,
                jungleSecretKey: document.getElementById('new-junglepay-secretKey').value
              };
              gatewayName = 'JunglePay Gateway';
            } else if (gatewayType === 'diasmarketplace') {
              credentials = {
                diasApiKey: document.getElementById('new-dias-apiKey').value,
                withdrawalToken: document.getElementById('new-dias-withdrawal').value
              };
              gatewayName = 'Dias Marketplace Gateway';
            }
            
            try {
              const response = await fetch('/api/gateway', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: gatewayName,
                  type: gatewayType,
                  credentials: credentials
                })
              });
              
              const result = await response.json();
              
              if (response.ok) {
                alert('Gateway added successfully!');
                window.location.reload();
              } else {
                alert('Error adding gateway: ' + (result.error || 'Unknown error'));
              }
            } catch (error) {
              alert('Error connecting to server: ' + error.message);
            }
          }
        `,
                }}
            />
        </Layout>
    );
};
