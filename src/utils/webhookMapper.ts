// Mappers for Webhook Responses (Aggregator -> User)
export interface UnifiedWebhookPayload {
    event: 'CHARGE_CREATED' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'PAYMENT_EXPIRED';
    data: {
        external_id?: string;
        gateway_transaction_id?: string;
        amount?: number;
        status: string;
        paid_at?: string;
        pix?: {
            qrcode?: string;
            image?: string;
            paymentLinkUrl?: string;
        };
        metadata?: any;
    };
}

export function mapWooviWebhook(payload: any): UnifiedWebhookPayload {
    // Woovi payload usually has event and charge
    // User Example: event: 'OPENPIX:CHARGE_COMPLETED', charge: { correlationID: '...', ... }

    // Check for charge object in various places just in case
    const charge = payload.charge || payload.pix?.charge || payload;

    // Determine Status
    const event = payload.event;
    let status = charge.status; // e.g. 'COMPLETED', 'ACTIVE', 'EXPIRED'

    // Normalize Status
    if (event === 'OPENPIX:CHARGE_COMPLETED' || event === 'woovi:CHARGE_COMPLETED' || status === 'COMPLETED') {
        status = 'PAID';
    } else if (event === 'OPENPIX:CHARGE_CREATED' || status === 'ACTIVE') {
        status = 'PENDING';
    } else if (event === 'OPENPIX:CHARGE_EXPIRED' || status === 'EXPIRED') {
        status = 'EXPIRED';
    }

    // Extract identifiers
    // User example shows correlationID in charge object
    const externalId = charge.correlationID || payload.pix?.customer?.correlationID || payload.pix?.payer?.correlationID;

    return {
        event: status === 'PAID' ? 'PAYMENT_RECEIVED' : (status === 'EXPIRED' ? 'PAYMENT_EXPIRED' : 'PAYMENT_FAILED'),
        data: {
            external_id: externalId,
            gateway_transaction_id: charge.transactionID || charge.identifier,
            amount: charge.value,
            status: status,
            paid_at: charge.paidAt || new Date().toISOString(),
            metadata: charge.additionalInfo
        }
    };
}

export function mapJunglePayWebhook(payload: any): UnifiedWebhookPayload {
    // JunglePay payload based on docs
    const statusMap: Record<string, string> = {
        'PAID': 'PAID',
        'REFUSED': 'FAILED',
        'CHARGEDBACK': 'CHARGEDBACK',
        'REFUNDED': 'REFUNDED'
    };

    return {
        event: payload.status === 'PAID' ? 'PAYMENT_RECEIVED' : 'PAYMENT_FAILED',
        data: {
            external_id: payload.externalRef,
            gateway_transaction_id: payload.id,
            amount: payload.amount,
            status: statusMap[payload.status] || payload.status,
            paid_at: payload.paidAt,
            metadata: payload.metadata
        }
    };
}

export function mapDiasWebhook(payload: any): UnifiedWebhookPayload {
    // DiasMarketplace payload same as JunglePay structure usually
    const statusMap: Record<string, string> = {
        'PAID': 'PAID',
        'REFUSED': 'FAILED',
        'CHARGEDBACK': 'CHARGEDBACK',
        'REFUNDED': 'REFUNDED'
    };

    return {
        event: payload.status === 'PAID' ? 'PAYMENT_RECEIVED' : 'PAYMENT_FAILED',
        data: {
            external_id: payload.externalRef,
            gateway_transaction_id: payload.id,
            amount: payload.amount,
            status: statusMap[payload.status] || payload.status,
            paid_at: payload.paidAt,
            metadata: payload.metadata
        }
    };
}

export async function dispatchWebhook(url: string, payload: UnifiedWebhookPayload) {
    console.log(`Dispatching webhook to ${url}`, JSON.stringify(payload, null, 2));
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Multigate-Webhook-Dispatcher/1.0'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Failed to dispatch webhook to ${url}: ${response.status} ${response.statusText}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Error dispatching webhook to ${url}:`, error);
        return false;
    }
}
