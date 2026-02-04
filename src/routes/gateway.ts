import { Hono } from "hono";
import { authenticate } from "../middleware/auth";
import {
  getGatewaysByTenant,
  createGateway,
  updateGatewayCredentials,
  getGatewayById,
  deleteGateway,
  getAllowedGatewayTypes
} from "../db/queries";
import { GatewayCredentials } from "../types";

type Variables = {
  userId: number;
  tenantId: string;
};

const gatewayRoutes = new Hono<{ Bindings: { DB: any }; Variables: Variables }>();

// Apply authentication to all gateway routes
gatewayRoutes.use("*", authenticate);

// Get all gateways for the authenticated user's tenant
gatewayRoutes.get("/", async (c) => {
  const tenantId = c.get("tenantId");
  const gateways = await getGatewaysByTenant(c.env.DB, tenantId);

  return c.json(gateways);
});

// Get a specific gateway
gatewayRoutes.get("/:id", async (c) => {
  const gatewayId = parseInt(c.req.param("id"));
  const tenantId = c.get("tenantId");

  if (isNaN(gatewayId)) {
    return c.json({ error: "Invalid gateway ID" }, 400);
  }

  const gateway = await getGatewayById(c.env.DB, gatewayId, tenantId);

  if (!gateway) {
    return c.json({ error: "Gateway not found" }, 404);
  }

  return c.json(gateway);
});

// Create a new gateway
gatewayRoutes.post("/", async (c) => {
  const tenantId = c.get("tenantId");
  const { name, type, credentials } = await c.req.json() as {
    name: string;
    type: 'openpix' | 'junglepay' | 'diasmarketplace';
    credentials: GatewayCredentials
  };

  // Validate gateway type
  const allowedTypes = getAllowedGatewayTypes();
  if (!allowedTypes.includes(type)) {
    return c.json({ error: `Invalid gateway type. Allowed types: ${allowedTypes.join(', ')}` }, 400);
  }

  // Validate required credentials based on type
  if (type === 'openpix') {
    if (!credentials.appId || !credentials.apiKey) {
      return c.json({ error: "OpenPix requires appId and apiKey" }, 400);
    }
  } else if (type === 'junglepay') {
    if (!credentials.junglePublicKey || !credentials.jungleSecretKey) {
      return c.json({ error: "JunglePay requires publicKey and secretKey" }, 400);
    }
  } else if (type === 'diasmarketplace') {
    if (!credentials.diasApiKey || !credentials.withdrawalToken) {
      return c.json({ error: "Dias Marketplace requires apiKey and withdrawalToken" }, 400);
    }
  }

  try {
    console.log('Creating gateway:', { name, type, tenantId });
    await createGateway(c.env.DB, name, type, tenantId, credentials);
    console.log('Gateway created successfully');
    return c.json({ success: true, message: "Gateway created successfully" });
  } catch (error) {
    console.error('Error creating gateway:', error);
    return c.json({ error: "Failed to create gateway", details: error instanceof Error ? error.message : String(error) }, 500);
  }
});

// Update gateway credentials
gatewayRoutes.put("/:id", async (c) => {
  const gatewayId = parseInt(c.req.param("id"));
  const tenantId = c.get("tenantId");
  const { credentials } = await c.req.json() as { credentials: GatewayCredentials };

  if (isNaN(gatewayId)) {
    return c.json({ error: "Invalid gateway ID" }, 400);
  }

  // Check if gateway exists and belongs to tenant
  const gateway = await getGatewayById(c.env.DB, gatewayId, tenantId);
  if (!gateway) {
    return c.json({ error: "Gateway not found" }, 404);
  }

  try {
    await updateGatewayCredentials(c.env.DB, gatewayId, tenantId, credentials);
    return c.json({ success: true, message: "Gateway credentials updated successfully" });
  } catch (error) {
    return c.json({ error: "Failed to update gateway" }, 500);
  }
});

// Delete a gateway
gatewayRoutes.delete("/:id", async (c) => {
  const gatewayId = parseInt(c.req.param("id"));
  const tenantId = c.get("tenantId");

  if (isNaN(gatewayId)) {
    return c.json({ error: "Invalid gateway ID" }, 400);
  }

  try {
    await deleteGateway(c.env.DB, gatewayId, tenantId);
    return c.json({ success: true, message: "Gateway deleted successfully" });
  } catch (error) {
    return c.json({ error: "Failed to delete gateway" }, 500);
  }
});

export default gatewayRoutes;