import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { hashPassword, verifyPassword } from "../utils/crypto";
import { createSession, deleteSession, getUserByEmail, createUser } from "../db/queries";

const authRoutes = new Hono<{ Bindings: { DB: any } }>();

authRoutes.post("/login", async (c) => {
  const { email: rawEmail, password } = await c.req.json();
  const email = rawEmail?.trim().toLowerCase();

  // Find user by email
  const user = await getUserByEmail(c.env.DB, email);

  if (!user || !password || !(await verifyPassword(password.trim(), user.password_hash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Create session
  const sessionId = await createSession(c.env.DB, user.id, user.tenant_id);

  // Set session cookie
  setCookie(c, "sessionId", sessionId, {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    path: "/",
    secure: true,
    sameSite: "Strict"
  });

  return c.json({ success: true });
});

authRoutes.post("/register", async (c) => {
  const { email: rawEmail, password } = await c.req.json();
  const email = rawEmail?.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await getUserByEmail(c.env.DB, email);
  if (existingUser) {
    return c.json({ error: "User already exists" }, 409);
  }

  // Create new tenant ID (in a real app, you might use UUIDs)
  const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  await createUser(c.env.DB, email, passwordHash, tenantId);

  return c.json({ success: true });
});

authRoutes.post("/logout", async (c) => {
  const sessionId = getCookie(c, "sessionId");

  if (sessionId) {
    await deleteSession(c.env.DB, sessionId);
  }

  setCookie(c, "sessionId", "", { maxAge: 0, path: "/" });
  return c.json({ success: true });
});

export default authRoutes;