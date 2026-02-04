import { UnifiedPaymentRequest } from "../types";

export function mapToWoovi(request: UnifiedPaymentRequest) {
    return {
        value: request.amount,
        correlationID: request.external_id || crypto.randomUUID(),
        comment: request.description,
        customer: {
            name: request.payer.name,
            taxID: request.payer.tax_id,
            email: request.payer.email,
            phone: request.payer.phone,
        },
    };
}

export function mapToJunglePay(request: UnifiedPaymentRequest) {
    const isCnpj = request.payer.tax_id.replace(/\D/g, '').length > 11;
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
                number: request.payer.tax_id.replace(/\D/g, ''),
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
        postbackUrl: request.callback_url,
    };

    if (request.method === 'credit_card' && request.credit_card) {
        payload.card = {
            hash: request.credit_card.token,
        };
        payload.installments = request.credit_card.installments;
    }

    return payload;
}

export function mapToDiasMarketplace(request: UnifiedPaymentRequest) {
    const methodMap: Record<string, string> = {
        pix: 'PIX',
        credit_card: 'CREDIT_CARD',
        boleto: 'BOLETO',
    };

    const payload: any = {
        amount: request.amount,
        currency: 'BRL',
        method: methodMap[request.method],
        description: request.description,
        externalRef: request.external_id,
        notificationUrl: request.callback_url,
        payer: {
            name: request.payer.name,
            taxId: request.payer.tax_id.replace(/\D/g, ''),
            email: request.payer.email,
            phone: request.payer.phone?.replace(/\D/g, ''),
        },
        items: [
            {
                quantity: 1,
                name: request.description,
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
