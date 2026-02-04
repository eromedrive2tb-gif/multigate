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