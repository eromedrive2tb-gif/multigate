// This file defines the database schema for reference
// Actual SQL schema is in the migrations folder

export interface User {
  id: number;
  email: string;
  password_hash: string;
  tenant_id: string;
  api_token: string | null;
  created_at: number;
}

export interface Gateway {
  id: number;
  name: string;
  type: string;
  tenant_id: string;
  credentials_json: string; // Encrypted JSON containing gateway credentials
  is_active: boolean;
  created_at: number;
}

export interface Session {
  id: string;
  user_id: number;
  tenant_id: string;
  expires_at: number;
  created_at: number;
}