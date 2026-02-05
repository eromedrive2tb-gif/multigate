// Global types for the application

// Extend global scope to include crypto and TextEncoder
declare global {
  // Use existing Crypto type if available, otherwise fallback
  interface Window {
    crypto: Crypto;
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

export interface Payer {
  name: string;
  tax_id: string; // CPF or CNPJ
  email: string;
  phone?: string;
}

export interface CreditCardData {
  token: string;
  installments: number;
}

export interface PaymentItem {
  name: string;
  price: number; // in cents
  quantity: number;
  type?: 'PHYSICAL' | 'DIGITAL';
}

export interface UnifiedPaymentRequest {
  amount: number; // in cents
  method: 'pix' | 'credit_card' | 'boleto';
  description: string;
  external_id?: string;
  gateway_type?: string; // Optional: specify which gateway to use by type (e.g. 'openpix')
  callback_url?: string;
  payer: Payer;
  credit_card?: CreditCardData;
  items?: PaymentItem[];
}

export interface GatewayCardProps {
  id: number;
  name: string;
  type: 'openpix' | 'junglepay' | 'diasmarketplace';
  credentialsConfigured: boolean;
  status: 'active' | 'inactive';
}