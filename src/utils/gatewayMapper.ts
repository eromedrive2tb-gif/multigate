import { UnifiedPaymentRequest, PaymentItem } from "../types";

export function mapToWoovi(request: UnifiedPaymentRequest) {
    const payload: any = {
        value: request.amount,
        correlationID: request.external_id || crypto.randomUUID(),
        comment: request.description,
    };

    // Customer/payer is optional for Woovi/OpenPix
    if (request.payer) {
        const customer: any = {};

        if (request.payer.name) customer.name = request.payer.name;
        if (request.payer.email) customer.email = request.payer.email;
        if (request.payer.phone) customer.phone = request.payer.phone.replace(/\D/g, '');
        if (request.payer.tax_id) customer.taxID = request.payer.tax_id.replace(/\D/g, '');

        // Only include customer if at least one field is provided
        if (Object.keys(customer).length > 0) {
            payload.customer = customer;
        }
    }

    return payload;
}

export function mapToJunglePay(request: UnifiedPaymentRequest, aggregatorWebhookUrl?: string) {
    // tax_id is validated at the endpoint level for JunglePay
    const isCnpj = request.payer.tax_id!.replace(/\D/g, '').length > 11;
    const paymentMethodMap: Record<string, string> = {
        pix: 'pix',
        credit_card: 'credit_card',
        boleto: 'boleto',
    };

    const payload: any = {
        amount: request.amount,
        paymentMethod: paymentMethodMap[request.method],
        customer: {
            name: request.payer.name,
            email: request.payer.email,
            document: {
                number: request.payer.tax_id!.replace(/\D/g, ''),
                type: isCnpj ? 'cnpj' : 'cpf',
            },
            phone: request.payer.phone?.replace(/\D/g, ''),
        },
        items: [
            {
                title: request.description,
                unitPrice: request.amount,
                quantity: 1,
                tangible: false,
            },
        ],
        // CRITICAL: Send to Aggregator, not directly to User.
        postbackUrl: aggregatorWebhookUrl,
    };

    if (request.method === 'credit_card' && request.credit_card) {
        payload.card = {
            hash: request.credit_card.token,
        };
        payload.installments = request.credit_card.installments;
    }

    return payload;
}

export function mapToDiasMarketplace(request: UnifiedPaymentRequest, aggregatorWebhookUrl?: string) {
    const methodMap: Record<string, string> = {
        pix: 'PIX',
        credit_card: 'CREDIT_CARD',
        boleto: 'BOLETO',
    };

    const payload: any = {
        amount: request.amount,
        currency: 'BRL',
        method: methodMap[request.method],
        description: request.description || 'Pagamento via Multigate',
        externalRef: request.external_id || crypto.randomUUID(),
        // CRITICAL: Send to Aggregator, not directly to User.
        notificationUrl: aggregatorWebhookUrl,
        payer: {
            name: request.payer.name,
            // tax_id is validated at the endpoint level for Dias Marketplace
            taxId: request.payer.tax_id!.replace(/\D/g, ''),
            email: request.payer.email,
            phone: request.payer.phone?.replace(/\D/g, ''),
        },
        items: request.items?.map((item: PaymentItem) => ({
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            type: 'DIGITAL', // Defaulting to DIGITAL as it's a software service context
        })) || [
                {
                    quantity: 1,
                    name: request.description || 'Item de pagamento',
                    price: request.amount,
                    type: 'DIGITAL',
                },
            ],
    };

    if (request.method === 'credit_card' && request.credit_card) {
        payload.card = {
            token: request.credit_card.token,
        };
    }

    return payload;
}
