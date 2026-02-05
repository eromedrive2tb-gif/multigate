
import { Hono } from "hono";
import {
    mapWooviWebhook,
    mapJunglePayWebhook,
    mapDiasWebhook,
    dispatchWebhook
} from "../utils/webhookMapper";
import {
    getTransactionByGatewayId,
    getTransactionByExternalRef,
    updateTransactionStatus,
    updateTransactionGatewayId
} from "../db/queries";

const webhookRoutes = new Hono<{ Bindings: { DB: any } }>();

// Woovi Webhook
webhookRoutes.post("/woovi", async (c) => {
    try {
        const payload = await c.req.json();
        console.log("Received Woovi Webhook:", JSON.stringify(payload));

        // Woovi sends { event: ..., charge: { correlationID: ... } }
        // During registration, it sends { evento: 'teste_webhook', ... }
        if (payload.evento === 'teste_webhook' || payload.event === 'teste_webhook') {
            console.log("Acknowledging Woovi test ping");
            return c.json({ success: true, message: "Test ping received" });
        }

        const charge = payload.charge || payload;
        const correlationID = charge.correlationID;

        if (!correlationID) {
            console.error("Woovi webhook missing correlationID");
            return c.json({ success: false }, 400);
        }

        // We use correlationID as external_ref in our system for Woovi
        const transaction = await getTransactionByExternalRef(c.env.DB, correlationID);

        if (!transaction) {
            console.error(`Transaction not found for properties: external_ref=${correlationID}`);
            // Return 200 to acknowledge webhook (preventing retries for untracked items)
            return c.json({ success: true, message: "Transaction ignored" });
        }

        const unifiedPayload = mapWooviWebhook(payload);

        // Update DB
        await updateTransactionStatus(c.env.DB, transaction.id, unifiedPayload.data.status);

        // Dispatch
        if (transaction.callback_url) {
            await dispatchWebhook(transaction.callback_url, unifiedPayload);
        }

        return c.json({ success: true });
    } catch (e) {
        console.error("Error processing Woovi webhook:", e);
        return c.json({ success: false }, 500);
    }
});

// JunglePay Webhook
webhookRoutes.post("/junglepay", async (c) => {
    try {
        const payload = await c.req.json();
        console.log("Received JunglePay Webhook:", JSON.stringify(payload));

        const gatewayTransactionId = payload.id; // JunglePay transaction ID

        // Try finding by gateway ID first
        let transaction = await getTransactionByGatewayId(c.env.DB, String(gatewayTransactionId));

        // If not found, try externalRef if available
        if (!transaction && payload.externalRef) {
            transaction = await getTransactionByExternalRef(c.env.DB, payload.externalRef);
            // If found by external ref, we should probably update the gateway ID
            if (transaction) {
                await updateTransactionGatewayId(c.env.DB, transaction.id, String(gatewayTransactionId));
            }
        }

        if (!transaction) {
            console.error(`Transaction not found for ID=${gatewayTransactionId}`);
            return c.json({ success: true, message: "Transaction ignored" });
        }

        const unifiedPayload = mapJunglePayWebhook(payload);

        // Update DB
        await updateTransactionStatus(c.env.DB, transaction.id, unifiedPayload.data.status);

        // Dispatch
        if (transaction.callback_url) {
            await dispatchWebhook(transaction.callback_url, unifiedPayload);
        }

        return c.json({ success: true });

    } catch (e) {
        console.error("Error processing JunglePay webhook:", e);
        return c.json({ success: false }, 500);
    }
});

// DiasMarketplace Webhook
webhookRoutes.post("/diasmarketplace", async (c) => {
    try {
        const payload = await c.req.json();
        console.log("Received DiasMarketplace Webhook:", JSON.stringify(payload));

        const gatewayTransactionId = payload.id;

        // Try finding by gateway ID first
        let transaction = await getTransactionByGatewayId(c.env.DB, String(gatewayTransactionId));

        if (!transaction && payload.externalRef) {
            transaction = await getTransactionByExternalRef(c.env.DB, payload.externalRef);
            if (transaction) {
                await updateTransactionGatewayId(c.env.DB, transaction.id, String(gatewayTransactionId));
            }
        }

        if (!transaction) {
            console.error(`Transaction not found for ID=${gatewayTransactionId}`);
            return c.json({ success: true, message: "Transaction ignored" });
        }

        const unifiedPayload = mapDiasWebhook(payload);

        await updateTransactionStatus(c.env.DB, transaction.id, unifiedPayload.data.status);

        if (transaction.callback_url) {
            await dispatchWebhook(transaction.callback_url, unifiedPayload);
        }

        return c.json({ success: true });

    } catch (e) {
        console.error("Error processing Dias webhook:", e);
        return c.json({ success: false }, 500);
    }
});

export default webhookRoutes;
