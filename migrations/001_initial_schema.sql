-- Users table with tenant isolation
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Gateways table with tenant association
CREATE TABLE gateways (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'openpix', 'junglepay', 'diasmarketplace'
  tenant_id TEXT NOT NULL,
  credentials_json TEXT NOT NULL, -- JSON containing gateway credentials (encrypted in production)
  is_active BOOLEAN DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Sessions table for authentication
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  tenant_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);