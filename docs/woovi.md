Como começar
Instalando
Preferencialmente, recomendamos o NodeJs em sua versão LTS (latest).

Execute o comando abaixo que instala as dependências necessárias com o npm:

$ npm install @woovi/node-sdk

Dessa forma, o SDK será instalado.

Criando o cliente
O ponto de entrada do SDK é um createClient para o serviço.

CommonJs:

const WooviSdk = require("@woovi/node-sdk");

// Para inicializar
const woovi = WooviSdk.createClient({appId: "seu-app-id"});

Ts/Module:

import { createClient } from "@woovi/node-sdk"

// Para inicializar
const woovi = createClient({appId: "seu-app-id"})

O método createClient cria um novo cliente a partir de um ID de aplicativo obtido no site da woovi.

Chamando a API
Um cliente possui recursos (por exemplo: clientes, cobranças, assinaturas, etc.) que podem ser acessados através de createClient.

woovi.customer

Cada recurso irá ter um conjunto de métodos que podem serem executados para realizarem operações:

const client = woovi.customer.create({}); //lembre-se de passar o payload de criação de cliente

Operações em recursos
Em cada recurso, há uma convenção nos nomes das operações, na qual, em sua maioria, se resumem em:

get: Obter apenas um recurso. Associado ao verbo HTTP GET.
list: Obter vários recursos, de forma paginada. Associado ao verbo HTTP GET.
create: Criar um recurso. Associado ao verbo HTTP POST.
delete: Remover um recurso. Associado ao verbo HTTP DELETE.
Formato das entradas
No caso de operações de listagem, normalmente se aceita um objeto com um uma chave opcional de paginação.

woovi.refund.list({ skip: 0, limit: 20 })

Formato de saída
A execução de uma operação irá devolver resultados da API na forma de um array direto ou na forma de um paginador, caso este seja aplicado ao metodo usado.

Tipagem
Em cada operação disponível para um determinado tipo de recurso, existem tipagens disponíveis direto na resposta, informando o formato de entrada e saída da operação com um link para a documentação da API Rest e exemplo de utilização.

Para utilizar, é sugerido utilizar um editor com Intellisense como Visual Studio Code.

Também é possível consultar a documentação no site da woovi caso haja dúvidas.

Recursos disponíveis
Os seguintes recursos estão disponíveis no Client gerado:

woovi.account: Operações em uma conta.
woovi.cashback: Operações em cashback.
woovi.charge: Operações em uma carga de pagamento.
woovi.chargeRefund: Operações em em extorno de uma carga.
woovi.customer: Operações em clientes.
woovi.partner: Operações em parceiros.
woovi.pixQrCode: Operações em codigos qr relacionados a pix.
woovi.refund: Operações em extorno.
woovi.subAccount: Operações em sub contas.
woovi.subscription: Operações em inscrições.
woovi.transactions: Operações em transações.
woovi.transfer: Operações em transferencias.
woovi.webhook: Operações em webhook.
Webhook
O método webhook conta com um recurso especial chamado handle, ótimo para ser usado para validar recursos diretamente na sua api. Veja a seguir como ultiliza-lo:

import { createClient } from "@woovi/node-sdk";

const woovi = createClient({ appId: "seu-app-id" });

const handler = woovi.webhook.handler({
  onChargeCompleted: async (payload) => {},
  onChargeExpired: async (payload) => {},
});

export const POST = handler.POST;

Post recebe sua requisição.

Dependências
O projeto não ultiliza de dependencias externas para seu funcionamento.

Marcadores:apinodejsjavascripttstypescriptsdk

Recursos
Conta
Chame o método account seu cliente da API para obter o recurso de contas.

Documentação do endpoint para mais detalhes.

Pegar uma conta
Chame o método get no recurso de contas passando um accountId:

Documentação do endpoint para mais detalhes.

const response = await woovi.account.get({ accountId: 'algum-id' });

Obter uma lista de contas
Obtenha as contas usando o método list no recurso de contas:

Documentação do endpoint para mais detalhes.

const response = await woovi.account.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional

Fazer uma retirada(withdraw)
Faça withdraw em uma conta usando do método withdraw no recurso de contas.

Documentação do endpoint para mais detalhes.

const response = await woovi.account.withdraw({
  accountId: 'string',
  value: 200,
});

na próxima compra de cashback
Chame o método cashbackFidelity seu cliente da API para obter o recurso de na próxima compra de cashback.

Documentação do endpoint para mais detalhes.

Pegar a quantidade de cashback que um usuário tem para receber
Chame o método get no recurso de na próxima compra de cashback passando um taxID:

Documentação do endpoint para mais detalhes.

const response = await woovi.cashbackFidelity.get({ taxID: 'algum-tax-id' });

Criar(ou pegar) uma na próxima compra de cashback pra um cliente
Crie o recurso chamando o método createno recurso de na próxima compra de cashback.

Documentação do endpoint para mais detalhes.

const response = await woovi.cashbackFidelity.create({
  value: 100,
  taxID: 11111111111,
});

Cobrança
Chame o método charge seu cliente da API para obter o recurso de cobrança.

Documentação do endpoint para mais detalhes.

Pegar uma cobrança
Chame o método get no recurso de cobranças passando um id:

Documentação do endpoint para mais detalhes.

const response = await woovi.charge.get({ id: 'algum-id' });

Obter uma lista de cobranças
Obtenha as cobranças usando o método list no recurso de cobranças:

Documentação do endpoint para mais detalhes.

const response = await woovi.charge.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional

Crie uma cobrança
Crie uma cobrança usando o método create no recurso de cobranças:

Documentação do endpoint para mais detalhes.

const response = await woovi.charge.create({
  correlationID: '9134e286-6f71-427a-bf00-241681624587',
  value: 100,
  comment: 'good',
  customer: {
    name: 'Dan',
    taxID: '31324227036',
    email: 'email0@example.com',
    phone: '5511999999999',
  },
  additionalInfo: [
    {
      key: 'Product',
      value: 'Pencil',
    },
    {
      key: 'Invoice',
      value: '18476',
    },
    {
      key: 'Order',
      value: '302',
    },
  ],
});

Pegar imagem de um qr code de uma cobrança
Obtenha o qr code de uma cobrança usando o método getQrCode no recurso de cobranças:

Documentação do endpoint para mais detalhes.

const response = await woovi.charge.getQrCode({ size: '768' });

Deletar uma cobrança
Delete uma cobrança usando o método delete no recurso de cobranças:

Documentação do endpoint para mais detalhes.

const response = await woovi.charge.delete({ id: 'algum-id' });

Estorno de Cobrança
Chame o método chargeRefund seu cliente da API para obter o recurso de estorno de uma cobrança.

Documentação do endpoint para mais detalhes.

Obter uma lista de estorno cobranças
Obtenha os estornos de cobrança usando o método list no recurso de estorno de cobrança:

Documentação do endpoint para mais detalhes.

const response = await woovi.chargeRefund.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional


Crie uma cobrança
Crie um estorno de cobrança usando o método create no recurso de estorno cobranças:

Documentação do endpoint para mais detalhes.

const response = await woovi.chargeRefund.create({
  id: 'algum-id',
  correlationID: 'a273e72c-9547-4c75-a213-3b0a2735b8d5',
  value: 100,
  comment: 'Comentário do reembolso',
});

Cliente
Chame o método customer seu cliente da API para obter o recurso de cliente.

Documentação do endpoint para mais detalhes.

Pegar uma cliente
Chame o método get no recurso de clientes passando um id:

Documentação do endpoint para mais detalhes.

const response = await woovi.customer.get({ id: 'algum-id' });

Obter uma lista de clientes
Obtenha os clientes usando o método list no recurso de clientes:

Documentação do endpoint para mais detalhes.

const response = await woovi.customer.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional

Crie uma cliente
Crie uma cliente usando o método create no recurso de clientes:

Documentação do endpoint para mais detalhes.

const response = await woovi.customer.create({
  name: 'Dan',
  taxID: '31324227036',
  email: 'email0@example.com',
  phone: '5511999999999',
  correlationID: '9134e286-6f71-427a-bf00-241681624586',
  address: {
    zipcode: '30421322',
    street: 'Street',
    number: '100',
    neighborhood: 'Neighborhood',
    city: 'Belo Horizonte',
    state: 'MG',
    complement: 'APTO',
    country: 'BR',
  },
});

Fazer update num cliente
Faça um update em um cliente usando o método update no recurso de clientes.

Documentação do endpoint para mais detalhes.

const response = await woovi.customer.update({
  correlationID: 'some id',
  name: 'Dan',
  email: 'email0@example.com',
  phone: '5511999999999',
  address: {
    zipcode: '30421322',
    street: 'Street',
    number: '100',
    neighborhood: 'Neighborhood',
    city: 'Belo Horizonte',
    state: 'MG',
    complement: 'APTO',
    country: 'BR',
  },
});

Parceiros
Chame o método partner seu cliente da API para obter o recurso de parceiros.

Documentação do endpoint para mais detalhes.

Pegar um pré-registro de parceiro
Chame o método getPreRegistration no recurso de parceiros passando um taxID:

Documentação do endpoint para mais detalhes.

const response = await woovi.partner.getPreRegistration({
  taxID: 'algum-tax-id',
});

Obter todos os pré-registros
Obtenha os pré-registros de parceiros usando o método list no recurso de parceiros:

Documentação do endpoint para mais detalhes.

const response = await woovi.partner.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional

Crie um parceiro
Crie uma parceiro usando o método create no recurso de parceiros:

Documentação do endpoint para mais detalhes.

const response = await woovi.partner.create({
  preRegistration: {
    name: 'Example LLC',
    taxID: {
      taxID: '11111111111111',
      type: 'BR:CNPJ',
    },
    website: 'examplellc.com',
  },
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@examplellc.com',
    phone: '+5511912345678',
  },
});

Criar uma aplicação para algum de seus pré-registros
Para criar uma aplicação, use o método createApplication no recurso de parceiros.

Documentação do endpoint para mais detalhes.

const response = await woovi.partner.createApplication({
  application: {
    name: 'MyAPIAccess',
    type: 'API',
  },
  taxID: {
    taxID: '65914571000187',
    type: 'BR:CNPJ',
  },
});

Pagamento
Chame o método payment seu cliente da API para obter o recurso de pagamentos.

Documentação do endpoint para mais detalhes.

Aprove um pagamento
Chame o método approve no recurso de pagamentos passando um correlationID:

Documentação do endpoint para mais detalhes.

const response = await woovi.payment.approve({
  correlationID: 'algum-correlation-id',
});

Obter um pagamento
Obtenha um pagamento usando o método get no recurso de pagamentos:

Documentação do endpoint para mais detalhes.

const response = await woovi.payment.get({ id: 'algum-id' });

Obter uma lista de pagamentos
Obtenha uma lista de pagamentos usando o método list no recurso de pagamentos.

Documentação do endpoint para mais detalhes.

const response = await woovi.payment.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional

Criar uma requisição de pagamento
Para criar uma requisição de pagamento, use o método create no recurso de payment.

Documentação do endpoint para mais detalhes.

const response = await woovi.payment.create({
  value: 100,
  destinationAlias: 'c4249323-b4ca-43f2-8139-8232aab09b93',
  destinationAliasType: 'RANDOM',
  comment: 'payment comment',
  correlationID: 'payment1',
  sourceAccountId: 'my-source-account-id',
});

Pegar um Qr Code
Chame o método pixQrCode seu cliente da API para obter o recurso de qr code.

Documentação do endpoint para mais detalhes.

Obter um qr code
Obtenha um qr code usando o método get no recurso de qr code:

Documentação do endpoint para mais detalhes.

const response = await woovi.pixQrCode.get({ id: 'algum-id' });

Obter uma lista de pagamentos
Obtenha uma lista de qr codes usando o método list no recurso de qr code.

Documentação do endpoint para mais detalhes.

const response = await woovi.pixQrCode.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional


Criar um qr code estático.
Para criar um qr code estático, use o método create no recurso de qr code.

Documentação do endpoint para mais detalhes.

const response = await woovi.pixQrCode.create({
  name: 'my-qr-code',
  correlationID: '9134e286-6f71-427a-bf00-241681624586',
  value: 100,
  comment: 'good',
});

Estorno
Chame o método refund seu cliente da API para obter o recurso de estorno.

Documentação do endpoint para mais detalhes.

Obter um estorno
Obtenha um estorno usando o método get no recurso de estorno:

Documentação do endpoint para mais detalhes.

const response = await woovi.refund.get({ id: 'algum-id' });

Obter uma lista de estornos
Obtenha uma lista de estornos usando o método list no recurso de estorno.

Documentação do endpoint para mais detalhes.

const response = await woovi.refund.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional

Criar um novo estorno
Para criar um estorno, use o método create no recurso de estorno.

Documentação do endpoint para mais detalhes.

const response = await woovi.refund.create({
  transactionEndToEndId: '9134e286-6f71-427a-bf00-241681624586',
  correlationID: '9134e286-6f71-427a-bf00-241681624586',
  value: 100,
  comment: 'Comentário do reembolso',
});

Assinatura
Chame o método subscription seu cliente da API para obter o recurso de assinatura.

Documentação do endpoint para mais detalhes.

Obter uma assinaturas
Obtenha uma assinatura de estornos usando o método get no recurso de assinatura.

Documentação do endpoint para mais detalhes.

const response = await woovi.subscription.get({ id: 'algum-id' });

Criar uma assinatura
Para criar uma assinatura, use o método create no recurso de assinatura.

Documentação do endpoint para mais detalhes.

const response = await woovi.subscriptions.create({
  value: 100,
  customer: {
    name: 'Dan',
    taxID: '31324227036',
    email: 'email0@example.com',
    phone: '5511999999999',
  },
  dayGenerateCharge: 15,
});

Transações
Chame o método transactions seu cliente da API para obter o recurso de transações.

Documentação do endpoint para mais detalhes.

Obter uma transação
Obtenha uma transação usando o método get no recurso de transações.

Documentação do endpoint para mais detalhes.

const response = await woovi.transactions.get({ id: 'algum-id' });

Obter uma lista de transações
Obtenha uma lista de transações usando o método list no recurso de transação.

Documentação do endpoint para mais detalhes.

const response = await woovi.transactions.list({
  pagination: { limit: 10, skip: 0 },
  query: {},
}); //o objeto de paginação e parametros de query é opcional

Transferencias
Chame o método transfer seu cliente da API para obter o recurso de transferencia.

Documentação do endpoint para mais detalhes.

Criar uma transferencia
Para criar uma transferencia, use o método create no recurso de transferencias.

Documentação do endpoint para mais detalhes.

const response = await woovi.transfer.create({
  value: 100,
  fromPixKey: 'from@woovi.com.br',
  toPixKey: 'to@woovi.com.br',
});

Webhooks
Chame o método webhook seu cliente da API para obter o recurso de webhook.

Documentação do endpoint para mais detalhes.

Deletar um webhook
Delete um webhook usando o método delete no recurso de webhooks.

Documentação do endpoint para mais detalhes.

const response = await woovi.webhook.delete({ id: 'algum-id' });

Obter uma lista de webhooks
Obtenha uma lista de webhooks usando o método list no recurso de webhook.

Documentação do endpoint para mais detalhes.

const response = await woovi.webhook.list({
  pagination: { limit: 10, skip: 0 },
  query: {},
}); //o objeto de paginação e query são opcionais

Criar um novo webhook
Para criar um webhook, use o método create no recurso de webhook.

Documentação do endpoint para mais detalhes.

const response = await woovi.webhook.create({
  webhook: {
    name: 'webhookName',
    event: 'woovi:CHARGE_CREATED',
    url: 'https://mycompany.com.br/webhook',
    authorization: 'woovi',
    isActive: true,
  },
});

Handler HTTP
O método webhook conta com um recurso especial chamado handle, ótimo para ser usado para validar recursos diretamente na sua api. Veja a seguir como ultiliza-lo:

import { createClient } from '@woovi/node-sdk';

const woovi = createClient({ appId: 'seu-app-id' });

const handler = woovi.webhook.handler({
  onChargeCompleted: async (payload) => {},
  onChargeExpired: async (payload) => {},
});

export const POST = handler.POST;

Post recebe sua requisição.

Isso permite com que você possa validar um webhook em uma api que você pode construir.

Subcontas
Chame o método subAccount seu cliente da API para obter o recurso de subcontas.

Documentação do endpoint para mais detalhes.

Pegar detalhes de uma subcontas
Para pegar detalhes de uma subconta, use o metodo getno recurso de subcontas.

Documentação do endpoint para mais detalhes.

const response = await woovi.subAccount.get({ id: 'algum-id' });

Listar subcontas
Obtenha uma lista de subcontas usando o método list no recurso de subcontas.

Documentação do endpoint para mais detalhes.

const response = await woovi.subAccount.list({ limit: 10, skip: 0 }); //o objeto de paginação é opcional


Criar uma nova subconta
Para criar um subconta, use o método create no recurso de subconta.

Documentação do endpoint para mais detalhes.

const response = await woovi.subAccount.create({
  pixKey: '9134e286-6f71-427a-bf00-241681624587',
  name: 'Test Account',
});

Fazer uma retirada(withdraw)
Faça withdraw em uma subconta usando do método withdraw no recurso de subcontas.

Documentação do endpoint para mais detalhes.

const response = await woovi.subAccount.withdraw({ id: 'pix-key' });

Manipulação de erros
Ao utilizar o SDK de Node, espera-se que a integração seja robusta. Sendo assim, é fundamental lidar com possíveis imprevistos da API ou do transporte de dados na forma de exceptions.

Quando a API retorna um erro, uma exception é lançada, onde é apresentado os erros da api. A Sdk foi construida de forma que, caso um erro seja obtido, a requisição é tentada novamente outras 2 vezes afim de minimizar erros falsos antes da exceção ser lançada.

É considerado erro todas as respostas de api em que status seja de uma faixa diferente de 200.

Veja como você pode capturar todos os possíveis erros do SDK:

import { createClient } from "./dist";

const woovi = createClient({ appId: "seu-app-id" });

try {
    woovi.transfer.create({fromPixKey: "pix-1", toPixKey: "pix-2", value: 100});
} catch (e) {
    console.log(e); //espera-se um objeto semelhante a: { error: "string" }
}

Como configurar o sdk para acessar o ambiente sandbox/teste?
Para configurar o sdk para utilizar os endpoints de sandbox basta alterar a contante que guarda a url base.

Como alterar a url base
Para alterar siga os seguintes passos:

acesse o arquivo que guarda as constantes do sdk: src/utils/constants/index.ts
procure pela constante API_BASE_URL que se encontra no inicio do arquivo
import type { BinaryToTextEncoding } from "node:crypto";

export const API_BASE_URL = "https://api.woovi.com" as const; //<- aqui se encontra a constante
export const API_RETRIES = 1 as const;
export const API_RETRIE_DELAY = 1000 as const;

export const SDK_VERSION: string = "1.0.0";

//... resto do arquivo

agora basta alterar para https://api.woovi-sandbox.com"
pronto o sdk agora ira sempre chamar os endpoints de sandbox
OBS: para voltar a chamar o endpoint de produção basta refazer o processo inserindo https://api.woovi.com"