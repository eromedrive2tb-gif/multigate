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

app.post("/api/unified/charge", apiAuthenticate, async (c: Context<{ Bindings: { DB: any }; Variables: ChargeVariables }>) => {
    const userId = c.get("userId");
    const tenantId = c.get("tenantId");

    try {
        const { amount, currency, gatewayType } = await c.req.json();

        return c.json({
            success: true,
            transactionId: `txn_${Date.now()}_${userId}`,
            amount,
            currency,
            gatewayUsed: gatewayType || 'auto',
            message: 'Charge processed successfully through the unified gateway',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return c.json({
            success: false,
            error: 'Failed to process charge',
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
