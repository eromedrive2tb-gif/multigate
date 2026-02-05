/** @jsxImportSource hono/jsx */

import { Hono } from "hono";
import { authenticate } from "../middleware/auth";
import { getGatewaysByTenant, getUserById, updateUserApiToken, getTransactionsByTenant } from "../db/queries";
import { generateSecureToken } from "../utils/crypto";
import { Dashboard } from "../components/Dashboard";
import { Transactions } from "../components/Transactions";
import { Documentation } from "../components/Documentation";

type Variables = {
    userId: number;
    tenantId: string;
};

const dashboardRoutes = new Hono<{ Bindings: { DB: any }; Variables: Variables }>();

dashboardRoutes.use("*", authenticate); // Apply authentication to all dashboard routes

dashboardRoutes.get("/", async (c) => {
    const tenantId = c.get("tenantId");
    const userId = c.get("userId");

    // Fetch gateways for this tenant only
    const gateways = await getGatewaysByTenant(c.env.DB, tenantId);
    const configuredTypes = gateways.map((g: any) => g.type);

    // Fetch user's aggregator API token from DB
    let user = await getUserById(c.env.DB, userId, tenantId);

    let aggregatorToken = user?.api_token;

    // If no token exists, generate one
    if (!aggregatorToken) {
        aggregatorToken = generateSecureToken();
        await updateUserApiToken(c.env.DB, userId, aggregatorToken);
    }

    return c.html(
        <Dashboard
            user={user}
            gateways={gateways}
            configuredTypes={configuredTypes}
            aggregatorToken={aggregatorToken}
        />
    );
});

dashboardRoutes.get("/transactions", async (c) => {
    const tenantId = c.get("tenantId");
    const transactions = await getTransactionsByTenant(c.env.DB, tenantId);

    return c.html(
        <Transactions transactions={transactions} />
    );
});

dashboardRoutes.post("/regenerate-token", async (c) => {
    const userId = c.get("userId");
    const newToken = generateSecureToken();
    await updateUserApiToken(c.env.DB, userId, newToken);
    return c.json({ success: true, token: newToken });
});

dashboardRoutes.get("/docs", async (c) => {
    const userId = c.get("userId");
    const tenantId = c.get("tenantId");

    // Get user's API token
    let user = await getUserById(c.env.DB, userId, tenantId);
    let aggregatorToken = user?.api_token;

    if (!aggregatorToken) {
        aggregatorToken = generateSecureToken();
        await updateUserApiToken(c.env.DB, userId, aggregatorToken);
    }

    // Get base URL from request
    const url = new URL(c.req.url);
    const baseUrl = `${url.protocol}//${url.host}/api`;

    return c.html(<Documentation baseUrl={baseUrl} aggregatorToken={aggregatorToken} />);
});

export default dashboardRoutes;
