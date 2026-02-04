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
          .gateway-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
          .gateway-card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px; transition: transform 0.2s; }
          .gateway-card:hover { transform: translateY(-5px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
          .gateway-card h3 { margin-top: 0; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .gateway-info p { margin: 8px 0; color: #555; }
          .credentials-status { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin-top: 10px; }
          .configured { background-color: #d4edda; color: #155724; }
          .not-configured { background-color: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Gateway Dashboard</h1>
            <button class="logout-btn" onclick="logout()">Logout</button>
          </header>
          
          <div class="gateway-grid" id="gateways-container">
            ${result.length > 0 ? result.map((gateway: any) => `
              <div class="gateway-card">
                <h3>${gateway.name}</h3>
                <div class="gateway-info">
                  <p><strong>Type:</strong> ${gateway.type}</p>
                  <p><strong>Status:</strong> 
                    <span class="credentials-status configured">Credentials Configured</span>
                  </p>
                </div>
              </div>
            `).join('') : `
              <div class="gateway-card">
                <h3>No Gateways Configured</h3>
                <p>You don't have any payment gateways configured yet. Contact your administrator to set up gateways.</p>
              </div>
            `}
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
        </script>
      </body>
    </html>
  `);
});

export default dashboardRoutes;