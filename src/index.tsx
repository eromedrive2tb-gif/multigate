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

        // Create transactions table
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            gateway_type TEXT NOT NULL,
            gateway_transaction_id TEXT,
            external_ref TEXT,
            callback_url TEXT,
            amount INTEGER,
            status TEXT DEFAULT 'PENDING',
            created_at INTEGER DEFAULT (unixepoch()),
            updated_at INTEGER DEFAULT (unixepoch())
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
import { getGatewaysByTenant, getGatewayById, getGatewayByType, createTransaction } from "./db/queries";
import { mapToWoovi, mapToJunglePay, mapToDiasMarketplace } from "./utils/gatewayMapper";
import { dispatchWebhook, UnifiedWebhookPayload } from "./utils/webhookMapper";
import webhookRoutes from "./routes/webhooks";

// Register Webhook Routes - No Auth required (gateways call this)
app.route("/api/webhooks", webhookRoutes);

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

        // Validate tax_id is required for JunglePay and Dias Marketplace
        if ((gateway.type === 'junglepay' || gateway.type === 'diasmarketplace') && !body.payer?.tax_id) {
            return c.json({
                success: false,
                error: 'payer.tax_id is required for JunglePay and Dias Marketplace gateways'
            }, 400);
        }

        const credentials = JSON.parse(gateway.credentials_json);
        let mappedPayload;
        let endpoint = '';
        const externalRef = body.external_id || crypto.randomUUID();
        // Ensure request has identifiers we can track
        body.external_id = externalRef;

        // Determine Aggregator Base URL for webhooks
        // In production, this should come from c.env.API_BASE_URL
        const url = new URL(c.req.url);
        const baseUrl = `${url.protocol}//${url.host}`;

        // 2. Map payload and set endpoint based on gateway type
        switch (gateway.type) {
            case 'openpix':
                mappedPayload = mapToWoovi(body);
                endpoint = 'https://api.woovi.com/api/v1/charge';
                break;
            case 'junglepay':
                mappedPayload = mapToJunglePay(body, `${baseUrl}/api/webhooks/junglepay`);
                endpoint = 'https://api.junglepagamentos.com/v1/transactions';
                break;
            case 'diasmarketplace':
                mappedPayload = mapToDiasMarketplace(body, `${baseUrl}/api/webhooks/diasmarketplace`);
                endpoint = 'https://api.diasmarketplace.com.br/v1/payment';
                break;
            default:
                return c.json({ success: false, error: 'Unsupported gateway type' }, 400);
        }

        // 3. Process the charge
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (gateway.type === 'openpix') {
            headers['Authorization'] = credentials.appId;
        } else if (gateway.type === 'junglepay') {
            headers['Authorization'] = `Bearer ${credentials.jungleSecretKey}`;
        } else if (gateway.type === 'diasmarketplace') {
            headers['Authorization'] = `Bearer ${credentials.diasApiKey}`;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(mappedPayload)
        });

        let result: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (!response.ok) {
            return c.json({
                success: false,
                gateway: gateway.type,
                error: `${gateway.type} API error: ${response.status}`,
                details: result
            }, response.status as any);
        }

        // Extract gateway transaction ID if possible
        let gatewayTransactionId = null;
        if (gateway.type === 'openpix') {
            // Woovi uses correlationID which is our externalRef, but they send back 'charge' object
            gatewayTransactionId = result.charge?.correlationID;
        } else {
            // Both JunglePay and Dias return 'id'
            gatewayTransactionId = result.id || result.payId; // Dias example shows 'pay_...' sometimes?
            // Actually Dias example shows "id": "pay_01..."
        }


        // 4. Save Transaction to DB
        await createTransaction(c.env.DB, {
            tenantId,
            gatewayType: gateway.type,
            gatewayTransactionId: gatewayTransactionId ? String(gatewayTransactionId) : undefined,
            externalRef: externalRef,
            callbackUrl: body.callback_url,
            amount: body.amount
        });


        // Standardize response based on gateway
        let pixData: any = {};

        if (gateway.type === 'openpix') {
            pixData = {
                qrcode: result.charge?.brCode || result.charge?.qrCodeString,
                image: result.charge?.qrCodeImage,
                paymentLinkUrl: result.charge?.paymentLinkUrl,
            };
        } else if (gateway.type === 'diasmarketplace') {
            pixData = {
                qrcode: result.data?.copypaste,
            };
        } else if (gateway.type === 'junglepay') {
            pixData = {
                qrcode: result.pix?.qrcode,
                image: result.pix?.qrcode_url,
                secureUrl: result.secureUrl,
            };
        }

        // 5. Dispatch CHARGE_CREATED webhook to callback_url if provided
        if (body.callback_url) {
            const webhookPayload: UnifiedWebhookPayload = {
                event: 'CHARGE_CREATED',
                data: {
                    external_id: externalRef,
                    gateway_transaction_id: gatewayTransactionId || undefined,
                    amount: body.amount,
                    status: 'PENDING',
                    pix: pixData,
                }
            };
            // Fire and forget - don't block response
            dispatchWebhook(body.callback_url, webhookPayload).catch(err => {
                console.error('Failed to dispatch CHARGE_CREATED webhook:', err);
            });
        }

        // Build final response (without full gatewayResponse for cleaner output)
        const standardizedResponse = {
            success: true,
            gateway: gateway.type,
            external_id: externalRef,
            gateway_transaction_id: gatewayTransactionId,
            status: 'PENDING',
            pix: pixData,
        };

        return c.json(standardizedResponse);

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
