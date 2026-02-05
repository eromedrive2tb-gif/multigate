# Análise do Fluxo de Pagamentos Unified/Charge

Esta análise descreve como o Multigate processa as requisições para cada gateway através do endpoint unificado.

## 🚀 Fluxo Geral
1. **Entrada**: O cliente envia uma requisição `POST` para `/api/unified/charge` com o seu `api_token`.
2. **Identificação**: O sistema identifica o gateway configurado para o usuário (ou usa o `gateway_type` se fornecido).
3. **Mapeamento**: Os dados padronizados são convertidos para o formato específico da API de destino.
4. **Execução**: O Multigate faz uma chamada `fetch` (POST) para o gateway.
5. **Retorno**: O Multigate padroniza a resposta do gateway para o cliente, incluindo os dados do PIX (QR Code).

---

## 🏗️ Detalhes por Gateway

### 1. OpenPix (Woovi)
- **URL Externa**: `https://api.woovi.com/api/v1/charge`
- **Autenticação**: Header `Authorization` contendo o `appId`.
- **Campos Principais**:
    - `value` (valor em centavos)
    - `correlationID` (seu ID externo)
    - `customer` (nome, taxID, email, telefone)
- **Resultado Estendido**: Retorna `charge.qrCodeString` e `charge.qrCodeImage`.

### 2. JunglePay
- **URL Externa**: `https://api.junglepagamentos.com/v1/transactions`
- **Autenticação**: Header `Authorization: Bearer <jungleSecretKey>`.
- **Webhook**: Envia `postbackUrl` apontando para `/api/webhooks/junglepay`.
- **Campos Principais**:
    - `amount`
    - `paymentMethod` (`pix`, `credit_card`, `boleto`)
    - `customer` (document type: `cpf` ou `cnpj`)
    - `items` (gerado automaticamente se não enviado)
- **Resultado Estendido**: Retorna `pix.qrcode` e `pix.qrcode_url`.

### 3. Dias Marketplace
- **URL Externa**: `https://api.diasmarketplace.com.br/v1/payment`
- **Autenticação**: Header `Authorization: Bearer <diasApiKey>`.
- **Webhook**: Envia `notificationUrl` apontando para `/api/webhooks/diasmarketplace`.
- **Campos Principais**:
    - `amount`
    - `method` (`PIX`, `CREDIT_CARD`, `BOLETO`)
    - `externalRef`
    - `payer` (nome, taxId, email)
    - `items` (lista de itens com `type: DIGITAL`)
- **Resultado Estendido**: Retorna `data.copypaste`.

---

## 📝 Resumo de Mapeamento (Unified -> Gateway)

| Campo Unified | OpenPix | JunglePay | Dias Marketplace |
| :--- | :--- | :--- | :--- |
| `amount` | `value` | `amount` | `amount` |
| `external_id` | `correlationID` | - | `externalRef` |
| `payer.tax_id` | `taxID` (limpo) | `document.number` | `taxId` (limpo) |
| `method` | (Sempre PIX) | `paymentMethod` | `method` |
| `callback_url` | (N/A) | `postbackUrl`* | `notificationUrl`* |

*\*As URLs de retorno são configuradas para apontar para o webhook do Multigate, que depois processa o status final.*
