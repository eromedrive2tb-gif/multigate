

// Define the D1Database type for TypeScript
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  all<T = any>(): Promise<{ results: T[] }>;
  run(): Promise<any>;
}

export const getUserById = async (db: D1Database, userId: number, tenantId: string) => {
  return await db.prepare(
    "SELECT id, email, api_token FROM users WHERE id = ? AND tenant_id = ?"
  ).bind(userId, tenantId).first<{ id: number, email: string, api_token: string | null }>();
};

export const getGatewaysByTenant = async (db: D1Database, tenantId: string) => {
  const result = await db.prepare(
    "SELECT id, name, type, credentials_json FROM gateways WHERE tenant_id = ? AND is_active = 1"
  ).bind(tenantId).all();
  return result.results;
};

export const getUserByEmail = async (db: D1Database, email: string) => {
  return await db.prepare(
    "SELECT id, email, password_hash, tenant_id, api_token FROM users WHERE email = ?"
  ).bind(email).first<{ id: number, email: string, password_hash: string, tenant_id: string, api_token: string | null }>();
};

export const getUserByApiToken = async (db: D1Database, token: string) => {
  return await db.prepare(
    "SELECT id, email, tenant_id FROM users WHERE api_token = ?"
  ).bind(token).first<{ id: number, email: string, tenant_id: string }>();
};

export const updateUserApiToken = async (db: D1Database, userId: number, token: string) => {
  await db.prepare(
    "UPDATE users SET api_token = ? WHERE id = ?"
  ).bind(token, userId).run();
};

export const createSession = async (db: D1Database, userId: number, tenantId: string) => {
  const sessionId = Array.from({ length: 16 }, () => Math.random().toString(36)[2]).join('');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await db.prepare(
    "INSERT INTO sessions (id, user_id, tenant_id, expires_at) VALUES (?, ?, ?, ?)"
  ).bind(sessionId, userId, tenantId, expiresAt).run();

  return sessionId;
};

export const deleteSession = async (db: D1Database, sessionId: string) => {
  await db.prepare(
    "DELETE FROM sessions WHERE id = ?"
  ).bind(sessionId).run();
};

export const createUser = async (db: D1Database, email: string, passwordHash: string, tenantId: string) => {
  await db.prepare(
    "INSERT INTO users (email, password_hash, tenant_id) VALUES (?, ?, ?)"
  ).bind(email, passwordHash, tenantId).run();
};

// Gateway-specific functions
export const createGateway = async (db: D1Database, name: string, type: 'openpix' | 'junglepay' | 'diasmarketplace', tenantId: string, credentials: any) => {
  const credentialsJson = JSON.stringify(credentials);

  console.log('About to insert gateway:', { name, type, tenantId });

  await db.prepare(
    "INSERT INTO gateways (name, type, tenant_id, credentials_json) VALUES (?, ?, ?, ?)"
  ).bind(name, type, tenantId, credentialsJson).run();

  console.log('Gateway inserted successfully');
};

export const updateGatewayCredentials = async (db: D1Database, gatewayId: number, tenantId: string, credentials: any) => {
  const credentialsJson = JSON.stringify(credentials);

  await db.prepare(
    "UPDATE gateways SET credentials_json = ? WHERE id = ? AND tenant_id = ?"
  ).bind(credentialsJson, gatewayId, tenantId).run();
};

export const getGatewayById = async (db: D1Database, gatewayId: number, tenantId: string) => {
  return await db.prepare(
    "SELECT id, name, type, credentials_json, is_active FROM gateways WHERE id = ? AND tenant_id = ?"
  ).bind(gatewayId, tenantId).first<any>();
};

export const deleteGateway = async (db: D1Database, gatewayId: number, tenantId: string) => {
  await db.prepare(
    "DELETE FROM gateways WHERE id = ? AND tenant_id = ?"
  ).bind(gatewayId, tenantId).run();
};

export const getAllowedGatewayTypes = (): Array<'openpix' | 'junglepay' | 'diasmarketplace'> => {
  return ['openpix', 'junglepay', 'diasmarketplace'];
};