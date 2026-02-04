// Global types for the application

// Extend global scope to include crypto and TextEncoder
declare global {
  var crypto: {
    subtle: any;
  };
  class TextEncoder {
    encode(input?: string): Uint8Array;
  }
  class TextDecoder {
    decode(input?: ArrayBuffer): string;
  }
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  tenant_id: string;
  created_at: number;
}

export interface Gateway {
  id: number;
  name: string;
  type: 'openpix' | 'junglepay' | 'diasmarketplace';
  tenant_id: string;
  credentials_json: string;
  is_active: boolean;
  created_at: number;
}

export interface GatewayCredentials {
  // OpenPix/Woovi credentials
  appId?: string;
  apiKey?: string;
  
  // JunglePay credentials
  junglePublicKey?: string;
  jungleSecretKey?: string;
  
  // Dias Marketplace credentials
  diasApiKey?: string;
  withdrawalToken?: string;
}

export interface AggregatorApiToken {
  token: string;
  userId: number;
  tenantId: string;
  createdAt: number;
}

export interface Session {
  id: string;
  user_id: number;
  tenant_id: string;
  expires_at: number;
  created_at: number;
}

export interface GatewayCardProps {
  id: number;
  name: string;
  type: 'openpix' | 'junglepay' | 'diasmarketplace';
  credentialsConfigured: boolean;
  status: 'active' | 'inactive';
}