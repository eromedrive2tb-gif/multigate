/** @jsxImportSource hono/jsx */

import { DashboardTemplate } from "./templates/DashboardTemplate";
import { Header } from "./organisms/Header";
import { ApiTokenCard } from "./organisms/ApiTokenCard";
import { GatewayCard } from "./organisms/GatewayCard";
import { AddGatewayCard } from "./organisms/AddGatewayCard";

interface Gateway {
  id: number;
  name: string;
  type: string;
  credentials_json: string;
  is_active: boolean;
}

interface DashboardProps {
  user: any;
  gateways: Gateway[];
  configuredTypes: string[];
  aggregatorToken: string;
}

export const Dashboard = ({ user, gateways, configuredTypes, aggregatorToken }: DashboardProps) => {
  const gatewayCards = gateways.map((gateway) => (
    <GatewayCard key={gateway.id} gateway={gateway} />
  ));

  const addGatewayCards = [
    !configuredTypes.includes('openpix') && (
      <AddGatewayCard
        key="add-openpix"
        type="openpix"
        title="Add OpenPix / Woovi"
        fields={[
          { label: 'App ID', id: 'new-openpix-appId', placeholder: 'App ID' }
        ]}
      />
    ),
    !configuredTypes.includes('junglepay') && (
      <AddGatewayCard
        key="add-junglepay"
        type="junglepay"
        title="Add JunglePay"
        fields={[
          { label: 'Public Key', id: 'new-junglepay-junglePublicKey', placeholder: 'Public Key' },
          { label: 'Secret Key', id: 'new-junglepay-jungleSecretKey', placeholder: 'Secret Key', type: 'password' }
        ]}
      />
    ),
    !configuredTypes.includes('diasmarketplace') && (
      <AddGatewayCard
        key="add-dias"
        type="diasmarketplace"
        title="Add Dias Marketplace"
        fields={[
          { label: 'API Key', id: 'new-dias-diasApiKey', placeholder: 'API Key' },
          { label: 'Withdrawal Token', id: 'new-dias-withdrawalToken', placeholder: 'Withdrawal Token', type: 'password' }
        ]}
      />
    )
  ].filter(Boolean);

  return (
    <DashboardTemplate
      header={<Header />}
      tokenCard={<ApiTokenCard token={aggregatorToken} />}
      gatewayCount={gateways.length}
      gatewayCards={gatewayCards}
      addGatewayCards={addGatewayCards}
      scripts={null}
    />
  );
};
