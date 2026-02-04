import { Context } from "hono";
import { getCookie } from "hono/cookie";

// Define the context with tenant variables and bindings
export const authenticate = async (c: Context<{ Bindings: { DB: any }; Variables: { userId: number; tenantId: string } }>, next: () => Promise<void>) => {
  const sessionId = getCookie(c, "sessionId");

  if (!sessionId) {
    return c.redirect("/login");
  }

  // Verify session exists in D1
  const session = await c.env.DB.prepare(
    "SELECT user_id, tenant_id, expires_at FROM sessions WHERE id = ? AND expires_at > ?"
  ).bind(sessionId, Date.now()).first();

  if (!session) {
    return c.redirect("/login");
  }

  // Attach user info to context for downstream handlers
  c.set("userId", session.user_id);
  c.set("tenantId", session.tenant_id);

  await next();
};

// Middleware to authenticate via API Token (Bearer)
export const apiAuthenticate = async (c: Context<{ Bindings: { DB: any }; Variables: { userId: number; tenantId: string } }>, next: () => Promise<void>) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized", message: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.substring(7); // "Bearer " is 7 characters

  // Look up user by api_token
  const user = await c.env.DB.prepare(
    "SELECT id, tenant_id FROM users WHERE api_token = ?"
  ).bind(token).first();

  if (!user) {
    return c.json({ error: "Unauthorized", message: "Invalid API token" }, 401);
  }

  // Attach user info to context
  c.set("userId", user.id);
  c.set("tenantId", user.tenant_id);

  await next();
};