Dias MarketPlace
2026
Introdução
Esta documentação apresenta a API de pagamentos da plataforma e descreve como integrá-la aos seus sistemas. Aqui estão detalhados os endpoints, formatos de requisição e respostas necessárias para o uso da API.

Descrição
A API utiliza o padrão REST e comunicação em JSON. As chamadas são organizadas para facilitar a implementação e manter consistência entre as operações disponíveis.

Autenticação
Todas as requisições à API devem ser autenticadas utilizando um token de acesso no padrão Bearer Token.
Para obter as suas credenciais de API, acesse a página Financeiro → Integrações no painel da plataforma.

Autenticação das Rotas de Pagamento
Na página Financeiro → Integrações, a chave para a utilização das rotas de pagamento fica na seção Credenciais de API.
Após encontrar sua chave, informe-a no cabeçalho Authorization da requisição HTTP, seguindo o padrão Bearer <sua_chave_de_api>.

NODE
const routeUrl = "https://api.diasmarketplace.com.br/v1/payment";
  const apiToken = "Bearer " + "SUA_CHAVE_DE_API";

  const payload = {
    amount: 25990,
    currency: "BRL",
    method: "PIX",
    description: "Pagamento de assinatura",
    externalRef: "order_98765",
    notificationUrl: "https://example.com/webhook/payment",
    payer: {
      name: "John Doe",
      taxId: "12345678901",
      email: "john.doe@example.com",
      phone: "11999999999",
    },
    "items": [
      {
        "quantity": 1,
        "name": "Produto Teste",
        "price": 1000,
        "type": "PHYSICAL"
      }
    ],
  };

  const response = await fetch(routeUrl, {
    method: "POST",
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log(data);
  
Autenticação das Rotas de Transferência
Para maior segurança, as rotas de transferência utilizam uma chave de API diferente.
Na página Financeiro → Integrações, a chave para a utilização das rotas de transferência fica na seção Credenciais de Saque via API.
Após encontrar sua chave, informe-a no cabeçalho Authorization da requisição HTTP, seguindo o padrão Bearer <sua_chave_de_api>.

NODE
const routeUrl = "https://api.diasmarketplace.com.br/v1/transfer";
  const apiToken = "Bearer " + "SUA_CHAVE_DE_API_DE_SAQUE";

  const payload = {
    "amount": 1000,
    "method": "PIX",
    "externalRef": "transfer_123",
    "notificationUrl": "https://example.com/webhook/transfer"
    "pix": {
      "pixKeyType": "EMAIL",
      "pixKey": "email@gmail.com"
    },
  };

  const response = await fetch(routeUrl, {
    method: "POST",
    headers: {
      Authorization: apiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log(data);
  
Nesta página
Descrição
Autenticação
Rotas de Pagamento
Rotas de Transferência
Começando - Dias MarketPlace

Tokenizando cartão
Para garantir a segurança dos dados sensíveis do cartão, nenhuma informação de cartão deve trafegar ou ser armazenada em texto puro. Neste fluxo, os dados do cartão são tokenizados no cliente utilizando criptografia assimétrica, e apenas o token criptografado é enviado para a API.

Descrição
A plataforma suporta duas formas de tokenização:

1. Via script de tokenização (Front-end) — recomendada para integrações diretas no browser, como checkouts web e aplicações client-side.
2. Via classe PaymentTokenizer (API / Back-end) — recomendada para integrações server-to-server, onde a criptografia ocorre no backend do integrador antes do envio para a API.

Como Funciona a Tokenização?
O processo de tokenização segue os seguintes passos:

1. Utilize a chave de API da plataforma.
2. Os dados do cartão são criptografados localmente usando essa chave.
3. O resultado é um token.
4. Esse token é enviado para a API de pagamentos no lugar dos dados do cartão.

Forma 1 - Tokenização no Front-end (Script)
Para realizar transações com cartão de crédito, é necessário incluir o token do cartão na requisição.
A geração desse token é simples e deve ser feita no front-end, antes de enviar os dados para a API.
Abaixo está o primeiro passo, que consiste em importar o script oficial de tokenização.

Inclusão do Script de Tokenização
Adicione o script abaixo na sua página HTML ou antes de utilizar a função de tokenização:

HTML
<script src="https://api.diasmarketplace.com.br/v1/scripts"></script>
Exemplo de Uso — Gerando o Token do Cartão
NODE
const pk = "CHAVE_DE_API"

try {
  const card = {
    number: "5555444433331111",
    holderName: "John Doe",
    expMonth: 8,
    expYear: 2027,
    cvv: "789",
  };

  await DiasMarketPlace.init(pk);
  const token = await DiasMarketPlace.encrypt(card);
  console.log(token);
} catch (err) {
  console.error(err);
}
Forma 2 — Tokenização via API (Classe PaymentTokenizer)
Essa forma é indicada para quem vai integrar via backend (API, workers ou server-to-server) e precisa tokenizar o cartão antes de enviar para a API de pagamentos.
A tokenização continua acontecendo no seu ambiente, usando criptografia assimétrica. Apenas o token é enviado para a plataforma.

Funcionamento
1. Utilize a chave de API da plataforma.
2. Sua aplicação inicializa a classe PaymentTokenizer com essa chave.
3. Os dados do cartão são validados e criptografados localmente.
4. O resultado é um token.
5. Esse token é enviado para a API de pagamentos no lugar dos dados do cartão.

Dependência
A classe utiliza libsodium para criptografia:

NODE
import sodium from "https://cdn.jsdelivr.net/npm/libsodium-wrappers@0.8.0/+esm
Classe PaymentTokenizer
NODE
import sodium from "https://cdn.jsdelivr.net/npm/libsodium-wrappers@0.8.0/+esm";

type CardDTO = {
  number: string;
  holder: string;
  expMonth: string;
  expYear: string;
  cvv: string;
};


class PaymentTokenizer {
  publicKey = "";
  initialized = false;

  async init(pk: string): Promise<void> {
    this.assertValidPublicKey(pk);
    await sodium.ready;
    this.publicKey = pk;
    this.initialized = true;
  }

  async encrypt(card: CardDTO): Promise<string> {
    if (!this.initialized || !this.publicKey) {
      throw new Error("TOKENIZER_NOT_INITIALIZED");
    }

    const payload = this.buildPayload(card);

    const encrypted = sodium.crypto_box_seal(sodium.from_string(JSON.stringify(payload)), sodium.from_base64(this.publicKey));

    return sodium.to_base64(encrypted);
  }

  buildPayload(card: CardDTO): CardDTO {
    return {
      number: this.validateCardNumber(card.number),
      holder: this.validateHolder(card.holder),
      expMonth: this.validateMonth(card.expMonth),
      expYear: this.validateYear(card.expYear),
      cvv: this.validateCvv(card.cvv),
    };
  }

  assertValidPublicKey(pk: string) {
    if (!pk || typeof pk !== "string" || pk.trim() === "") {
      throw new Error("INVALID_PUBLIC_KEY");
    }
  }

  validateHolder(value: string): string {
    if (!value?.trim()) {
      throw new Error("INVALID_CARD_HOLDER");
    }
    return value.trim();
  }

  validateCardNumber(value: string): string {
    const number = String(value ?? "").replace(/\D/g, "");

    if (!/^\d{13,19}$/.test(number)) {
      throw new Error("INVALID_CARD_NUMBER");
    }

    return number;
  }

  validateMonth(value: string): string {
    const monthStr = String(value ?? "").replace(/\D/g, "");

    if (!/^\d{2}$/.test(monthStr)) {
      throw new Error("INVALID_EXP_MONTH");
    }

    const month = Number(monthStr);

    if (month < 1 || month > 12) {
      throw new Error("INVALID_EXP_MONTH");
    }

    return monthStr;
  }

  validateYear(value: string): string {
    const yearStr = String(value ?? "").replace(/\D/g, "");

    if (!/^\d{4}$/.test(yearStr)) {
      throw new Error("INVALID_EXP_YEAR");
    }

    const year = Number(yearStr);
    const currentYear = new Date().getFullYear();
    if (year < currentYear) {
      throw new Error("CARD_EXPIRED");
    }
    return yearStr;
  }

  validateCvv(value: string): string {
    const cvv = String(value ?? "").replace(/\D/g, "");

    if (!/^\d{3,4}$/.test(cvv)) {
      throw new Error("INVALID_CVV");
    }

    return cvv;
  }
}
Classe PaymentTokenizer
NODE
import { PaymentTokenizer } from "./PaymentTokenizer";

const pk = "SUA_CHAVE_DE_API";

async function tokenizeCard() {
  const tokenizer = new PaymentTokenizer();
  await tokenizer.init(pk);

  const token = await tokenizer.encrypt({
    number: "4111111111111111",
    holder: "JOHN DOE",
    expMonth: "12",
    expYear: "2030",
    cvv: "123"
  });

  console.log("Token do cartão:", token);
}

tokenizeCard();

Webhooks - Pagamentos
Esta página descreve o formato do webhook enviado pela plataforma sempre que houver uma atualização no status de um pagamento.

Descrição
O webhook de pagamento é enviado automaticamente sempre que o status do pagamento for alterado, permitindo que o sistema do integrador mantenha suas informações sincronizadas em tempo real.

As notificações são enviadas via requisições HTTP no método POST, utilizando o formato JSON.

Endpoint de Notificação
A URL de notificação deve ser informada no momento da criação do pagamento, através do campo <code>notificationUrl</code>.

O endpoint deve estar acessível publicamente e responder com HTTP 200 para confirmar o recebimento do webhook.

Além disso, as notificações de pagamento também podem ocorrer via webhook in-bound, configurado diretamente no painel do gateway. Nesse modelo, o endpoint é previamente cadastrado e será acionado automaticamente a cada mudança de status do pagamento.

Status do Pagamento
Os possíveis valores para o campo status são:

PENDING – Pagamento criado e aguardando confirmação.
PROCESSING – Pagamento em processamento ou em análise.
PAID – Pagamento confirmado com sucesso.
REFUSED – Pagamento recusado pelo emissor ou sistema antifraude.
REFUNDED – Pagamento estornado total ou parcialmente.
MED – Contestação em análise preliminar, aguardando evidências.
CHARGEDBACK – Contestação confirmada com reversão do pagamento.

Formato do Payload
Abaixo estão exemplos de payload enviados no webhook de acordo com o meio de pagamento.

JSON
{
  "id": "pay_01HXYZ123ABC456DEF789",
  "amount": 10000,
  "method": "PIX",
  "currency": "BRL",
  "status": "PAID",
  "description": "Pagamento de teste via PIX",
  "installments": 1,
  "payer": {
    "name": "John Doe",
    "taxId": "12345678900",
    "email": "john.doe@example.com",
    "phone": "11999990000"
  },
  "externalRef": "order_123456",
  "notificationUrl": "https://example-webhook.test/notifications",
  "metadata": null,
  "paidAt": "2026-01-15T16:51:42.782Z",
  "refundedAt": null,
  "createdAt": "2026-01-15T13:44:25.838Z",
  "updatedAt": "2026-01-15T16:51:42.782Z",
  "orderId": null,
  "data": {
    "method": "PIX",
    "copypaste": "00020101021226850014br.gov.bcb.pix2563api.gateway.test/pix/123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5920GATEWAY TESTE6009SaoPaulo61080540900062070503***6304ABCD",
    "e2e": "E1234567890123456789012345678901"
  },
  "splits": [
    {
      "amount": 10000,
      "currency": "BRL",
      "percent": 100,
      "storeId": "store_test_001",
      "splitId": null
    }
  ],
  "items": [
    {
      "quantity": 1,
      "name": "Produto Teste",
      "price": 1000,
      "type": "PHYSICAL"
    }
  ]
}

Criar Pagamento
POST
https://api.diasmarketplace.com.br/v1/payment
Para criar um pagamento, utilize a rota v1/payment. Essa rota é compatível com pagamentos via cartão de crédito, boleto bancário e PIX.

Body
Corpo da requisição em JSON.

amount
integer
obrigatório
Valor total do pagamento em centavos. Exemplo: R$ 1,00.


R$ 0,00
currency
string
obrigatório
Moeda do pagamento (ex: BRL, USD, EUR).



method
string
obrigatório
Método de pagamento (PIX, BOLETO, CREDIT_CARD).



description
string
obrigatório
Descrição do pagamento.


externalRef
string
Referência externa do pagamento.


notificationUrl
string
URL para onde os webhooks do pagamento serão enviados.


ip
string
Endereço IP do cliente.


payer
object
obrigatório
Dados de quem está realizando o pagamento.

items
array of objects
obrigatório
Lista de produtos que compõem o pagamento.

splits
array of strings
Lista de IDs de splits. Exemplo: ["split_id_1", "split_id_2"].

card
object
Dados do cartão de crédito caso seja method = CREDIT_CARD.

boleto
object
Dados obrigatórios caso seja method = BOLETO.

metadata
object
Metadados do pagamento utilizados para rastreabilidade e controle.

Responses
Respostas possíveis retornadas pelo endpoint.

Token de Autenticação
Bearer

Insira seu token de acesso
Utilize o token fornecido para autenticação nas requisições da API.

Linguagem da documentação
Escolha uma linguagem e os exemplos de código serão exibidos.

SHELL
curl --request POST \
  --url https://api.diasmarketplace.com.br/v1/payment \
  --header 'Authorization: Bearer ' \
  --header 'accept: application/json' \
  --header 'content-type: application/json'
Resposta
Resposta da requisição
Execute uma requisição para visualizar aqui o retorno da API ou selecione um exemplo de resposta.

Clique em Executar para enviar a requisição e visualizar a resposta.

200
Resposta de sucesso
400
Resposta de erro
JSON
{
  "id": "pay_01HXYZ123ABC456DEF789",
  "amount": 10000,
  "method": "PIX",
  "currency": "BRL",
  "status": "PAID",
  "description": "Pagamento de teste via PIX",
  "installments": 1,
  "payer": {
    "name": "John Doe",
    "taxId": "12345678900",
    "email": "john.doe@example.com",
    "phone": "11999990000"
  },
  "externalRef": "order_123456",
  "notificationUrl": "https://example-webhook.test/notifications",
  "metadata": null,
  "paidAt": "2026-01-15T16:51:42.782Z",
  "refundedAt": null,
  "createdAt": "2026-01-15T13:44:25.838Z",
  "updatedAt": "2026-01-15T16:51:42.782Z",
  "orderId": null,
  "data": {
    "method": "PIX",
    "copypaste": "00020101021226850014br.gov.bcb.pix2563api.gateway.test/pix/123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5920GATEWAY TESTE6009SaoPaulo61080540900062070503***6304ABCD",
    "e2e": "E1234567890123456789012345678901"
  },
  "splits": [
    {
      "amount": 10000,
      "currency": "BRL",
      "percent": 100,
      "storeId": "store_test_001",
      "splitId": null
    }
  ],