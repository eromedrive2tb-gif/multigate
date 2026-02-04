import { Hono } from "hono";
import { authenticate } from "../middleware/auth";
import { getGatewaysByTenant } from "../db/queries";

type Variables = {
  userId: number;
  tenantId: string;
};

const dashboardRoutes = new Hono<{ Bindings: { DB: any }; Variables: Variables }>();

dashboardRoutes.use("*", authenticate); // Apply authentication to all dashboard routes

dashboardRoutes.get("/", async (c) => {
  const tenantId = c.get("tenantId");
  
  // Fetch gateways for this tenant only
  const result = await getGatewaysByTenant(c.env.DB, tenantId);
  
  // Fetch user's aggregator API token
  const userId = c.get("userId");
  const aggregatorToken = `agg_${tenantId.substring(0, 8)}_${userId}`; // Simplified token generation
  
  // Return HTML response with gateway cards
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Multi-Tenancy Dashboard</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 1200px; margin: 0 auto; }
          header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
          h1 { color: #333; margin: 0; }
          .logout-btn { padding: 10px 15px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
          .logout-btn:hover { background: #c0392b; }
          .api-token-section { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; }
          .api-token-display { background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; word-break: break-all; }
          .copy-token-btn { margin-top: 10px; padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .copy-token-btn:hover { background: #2980b9; }
          .gateway-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
          .gateway-card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px; transition: transform 0.2s; }
          .gateway-card:hover { transform: translateY(-5px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
          .gateway-card h3 { margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .gateway-info p { margin: 8px 0; color: #555; }
          .credentials-status { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-top: 10px; }
          .configured { background-color: #d4edda; color: #155724; }
          .not-configured { background-color: #f8d7da; color: #721c24; }
          .gateway-details { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #eee; }
          .credential-item { font-size: 12px; margin: 3px 0; }
          .credential-label { font-weight: bold; color: #777; }
          .credential-input { width: 100%; padding: 5px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
          .save-btn { margin-top: 10px; padding: 8px 15px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; }
          .save-btn:hover { background: #219653; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Gateway Aggregator Dashboard</h1>
            <button class="logout-btn" onclick="logout()">Logout</button>
          </header>
          
          <!-- API Token Section -->
          <section class="api-token-section">
            <h2>Your Aggregator API Token</h2>
            <p>Use this token to make requests to our unified gateway endpoint:</p>
            <div class="api-token-display" id="apiTokenDisplay">${aggregatorToken}</div>
            <button class="copy-token-btn" onclick="copyToken()">Copy Token</button>
            <p style="margin-top: 10px;"><small>Endpoint: <code>POST /api/unified/charge</code> with <code>Authorization: Bearer ${aggregatorToken}</code></small></p>
          </section>
          
          <h2>Payment Gateways</h2>
          <div class="gateway-grid" id="gateways-container">
            ${result.length > 0 ? result.map((gateway: any) => {
              let credentialFields = '';
              try {
                const creds = JSON.parse(gateway.credentials_json);
                
                if (gateway.type === 'openpix') {
                  credentialFields = `
                    <div class="credential-item">
                      <label class="credential-label">App ID:</label>
                      <input type="text" class="credential-input" id="openpix-appId-${gateway.id}" value="${creds.appId || ''}" placeholder="Enter App ID">
                    </div>
                    <div class="credential-item">
                      <label class="credential-label">API Key:</label>
                      <input type="password" class="credential-input" id="openpix-apiKey-${gateway.id}" value="${creds.apiKey || ''}" placeholder="Enter API Key">
                    </div>
                  `;
                } else if (gateway.type === 'junglepay') {
                  credentialFields = `
                    <div class="credential-item">
                      <label class="credential-label">Public Key:</label>
                      <input type="text" class="credential-input" id="junglepay-publicKey-${gateway.id}" value="${creds.junglePublicKey || ''}" placeholder="Enter Public Key">
                    </div>
                    <div class="credential-item">
                      <label class="credential-label">Secret Key:</label>
                      <input type="password" class="credential-input" id="junglepay-secretKey-${gateway.id}" value="${creds.jungleSecretKey || ''}" placeholder="Enter Secret Key">
                    </div>
                  `;
                } else if (gateway.type === 'diasmarketplace') {
                  credentialFields = `
                    <div class="credential-item">
                      <label class="credential-label">API Key:</label>
                      <input type="text" class="credential-input" id="dias-apiKey-${gateway.id}" value="${creds.diasApiKey || ''}" placeholder="Enter API Key">
                    </div>
                    <div class="credential-item">
                      <label class="credential-label">Withdrawal Token:</label>
                      <input type="password" class="credential-input" id="dias-withdrawal-${gateway.id}" value="${creds.withdrawalToken || ''}" placeholder="Enter Withdrawal Token">
                    </div>
                  `;
                }
              } catch (e) {
                credentialFields = '<div class="credential-item">Error loading credentials</div>';
              }
              
              return `
                <div class="gateway-card">
                  <h3>${gateway.name}</h3>
                  <div class="gateway-info">
                    <p><strong>Type:</strong> ${gateway.type}</p>
                    <p><strong>Status:</strong> 
                      <span class="credentials-status configured">Active</span>
                    </p>
                    <div class="gateway-details">
                      <p><strong>Credentials:</strong></p>
                      ${credentialFields}
                      <button class="save-btn" onclick="saveCredentials('${gateway.type}', ${gateway.id})">Save Changes</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('') : ''}
            
            <!-- Gateway configuration cards for users with no gateways configured -->
            <div class="gateway-card" id="openpix-card">
              <h3>OpenPix / Woovi</h3>
              <div class="gateway-info">
                <p><strong>Type:</strong> Pix Gateway</p>
                <p><strong>Status:</strong> 
                  <span class="credentials-status not-configured">Not Configured</span>
                </p>
                <div class="gateway-details">
                  <div class="credential-item">
                    <label class="credential-label">App ID:</label>
                    <input type="text" class="credential-input" id="new-openpix-appId" placeholder="Enter App ID">
                  </div>
                  <div class="credential-item">
                    <label class="credential-label">API Key:</label>
                    <input type="password" class="credential-input" id="new-openpix-apiKey" placeholder="Enter API Key">
                  </div>
                  <button class="save-btn" onclick="saveNewGateway('openpix')">Add Gateway</button>
                </div>
              </div>
            </div>
            
            <div class="gateway-card" id="junglepay-card">
              <h3>JunglePay</h3>
              <div class="gateway-info">
                <p><strong>Type:</strong> Payment Processor</p>
                <p><strong>Status:</strong> 
                  <span class="credentials-status not-configured">Not Configured</span>
                </p>
                <div class="gateway-details">
                  <div class="credential-item">
                    <label class="credential-label">Public Key:</label>
                    <input type="text" class="credential-input" id="new-junglepay-publicKey" placeholder="Enter Public Key">
                  </div>
                  <div class="credential-item">
                    <label class="credential-label">Secret Key:</label>
                    <input type="password" class="credential-input" id="new-junglepay-secretKey" placeholder="Enter Secret Key">
                  </div>
                  <button class="save-btn" onclick="saveNewGateway('junglepay')">Add Gateway</button>
                </div>
              </div>
            </div>
            
            <div class="gateway-card" id="diasmarketplace-card">
              <h3>Dias Marketplace</h3>
              <div class="gateway-info">
                <p><strong>Type:</strong> Marketplace Platform</p>
                <p><strong>Status:</strong> 
                  <span class="credentials-status not-configured">Not Configured</span>
                </p>
                <div class="gateway-details">
                  <div class="credential-item">
                    <label class="credential-label">API Key:</label>
                    <input type="text" class="credential-input" id="new-dias-apiKey" placeholder="Enter API Key">
                  </div>
                  <div class="credential-item">
                    <label class="credential-label">Withdrawal Token:</label>
                    <input type="password" class="credential-input" id="new-dias-withdrawal" placeholder="Enter Withdrawal Token">
                  </div>
                  <button class="save-btn" onclick="saveNewGateway('diasmarketplace')">Add Gateway</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <script>
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
                // Reload the page to show the new gateway
                window.location.reload();
              } else {
                alert('Error adding gateway: ' + (result.error || 'Unknown error'));
              }
            } catch (error) {
              alert('Error connecting to server: ' + error.message);
            }
          }
        </script>
      </body>
    </html>
  `);
});

export default dashboardRoutes;