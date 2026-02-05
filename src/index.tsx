/** @jsxImportSource hono/jsx */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie } from "hono/cookie";
import { Context } from "hono";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import gatewayRoutes from "./routes/gateway";
import { apiAuthenticate } from "./middleware/auth";
import { Login } from "./components/Login";

// Initialize database tables if they don't exist
async function initializeDatabase(env: { DB: any }) {
    try {
        // Create users table
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      api_token TEXT UNIQUE,
      created_at INTEGER DEFAULT (unixepoch())
    )`).run();

        // Check if api_token column exists (for older databases)
        try {
            await env.DB.prepare("SELECT api_token FROM users LIMIT 1").run();
        } catch (e) {
            // Column doesn't exist, add it
            await env.DB.prepare("ALTER TABLE users ADD COLUMN api_token TEXT").run();
            await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_api_token ON users(api_token)").run();
        }

        // Create gateways table
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS gateways (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      credentials_json TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at INTEGER DEFAULT (unixepoch())
    )`).run();

        // Create sessions table
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      tenant_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER DEFAULT (unixepoch()),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`).run();
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

type Bindings = {
    DB: any;
    ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("*", cors());

// Initialize database on first request
app.use("*", async (c, next) => {
    await initializeDatabase(c.env);
    await next();
});

// Routes
app.route("/auth", authRoutes);
app.route("/dashboard", dashboardRoutes);
app.route("/api/gateway", gatewayRoutes);

// Login page route - Refactored to Hono JSX
app.get("/login", (c) => {
    return c.html(<Login />);
});

// Unified charge endpoint
type ChargeVariables = {
    userId: number;
    tenantId: string;
};

import { UnifiedPaymentRequest } from "./types";
import { getGatewaysByTenant, getGatewayById, getGatewayByType } from "./db/queries";
import { mapToWoovi, mapToJunglePay, mapToDiasMarketplace } from "./utils/gatewayMapper";

app.post("/api/unified/charge", apiAuthenticate, async (c: Context<{ Bindings: { DB: any }; Variables: ChargeVariables }>) => {
    const tenantId = c.get("tenantId");

    try {
        const body = await c.req.json() as UnifiedPaymentRequest;

        // 1. Find the appropriate gateway
        let gateway;
        if (body.gateway_type) {
            gateway = await getGatewayByType(c.env.DB, body.gateway_type, tenantId);
        } else {
            const gateways = await getGatewaysByTenant(c.env.DB, tenantId);
            gateway = gateways[0]; // Simple selection: use the first active gateway
        }

        if (!gateway) {
            return c.json({ success: false, error: 'No active gateway found for this tenant' }, 404);
        }

        const credentials = JSON.parse(gateway.credentials_json);
        let mappedPayload;
        let endpoint = '';

        // 2. Map payload and set endpoint based on gateway type
        switch (gateway.type) {
            case 'openpix':
                mappedPayload = mapToWoovi(body);
                endpoint = 'https://api.woovi.com/api/v1/charge';
                break;
            case 'junglepay':
                mappedPayload = mapToJunglePay(body);
                endpoint = 'https://api.junglepagamentos.com/v1/transactions';
                break;
            case 'diasmarketplace':
                mappedPayload = mapToDiasMarketplace(body);
                endpoint = 'https://api.diasmarketplace.com.br/v1/payment';
                break;
            default:
                return c.json({ success: false, error: 'Unsupported gateway type' }, 400);
        }

        // 3. Process the charge (Actual fetch for OpenPix)
        if (gateway.type === 'openpix') {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': credentials.appId,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mappedPayload)
            });

            let result;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            if (!response.ok) {
                return c.json({
                    success: false,
                    error: `Woovi API error: ${response.status}`,
                    details: result
                }, response.status as any);
            }

            return c.json({
                success: true,
                gateway: 'openpix',
                gatewayResponse: result,
                message: 'Charge created successfully via OpenPix'
            });
        }

        // Mocking responses for other gateways for now
        return c.json({
            success: true,
            gateway: gateway.type,
            gatewayTransactionId: `gw_${Math.random().toString(36).substring(7)}`,
            amount: body.amount,
            message: 'Payment processed successfully through unified API (Mock)',
            mappedPayload
        });

    } catch (error) {
        console.error('Unified charge error:', error);
        return c.json({
            success: false,
            error: 'Failed to process unified charge',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// Root redirect to login
app.get("/", (c) => {
    const sessionId = getCookie(c, "sessionId");
    if (sessionId) {
        return c.redirect("/dashboard");
    }
    return c.redirect("/login");
});

export default app;
