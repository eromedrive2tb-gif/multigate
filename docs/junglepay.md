# Criar transação

Para criar uma transação, use a rota /transactions, tanto para cartão de crédito, boleto ou PIX.

# OpenAPI definition

````json
{
  "openapi": "3.1.0",
  "info": {
    "title": "API V1",
    "version": "1.0"
  },
  "servers": [
    {
      "url": "https://api.junglepagamentos.com/v1"
    }
  ],
  "components": {
    "securitySchemes": {
      "sec0": {
        "type": "http",
        "scheme": "basic"
      }
    }
  },
  "security": [
    {
      "sec0": []
    }
  ],
  "paths": {
    "/transactions": {
      "post": {
        "summary": "Criar transação",
        "description": "Para criar uma transação, use a rota /transactions, tanto para cartão de crédito, boleto ou PIX.",
        "operationId": "criar-transacao",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "amount",
                  "paymentMethod",
                  "customer",
                  "items"
                ],
                "properties": {
                  "amount": {
                    "type": "integer",
                    "description": "Valor em centavos (500 = R$ 5,00)",
                    "format": "int32"
                  },
                  "paymentMethod": {
                    "type": "string",
                    "description": "Meio de pagamento. Valores possíveis: **credit_card**, **boleto**, **pix**."
                  },
                  "card": {
                    "type": "object",
                    "description": "Informações do cartão do cliente. **Obrigatório** caso **paymentMethod** seja **credit_card**.",
                    "required": [
                      "id",
                      "hash",
                      "number",
                      "holderName",
                      "expirationMonth",
                      "expirationYear"
                    ],
                    "properties": {
                      "id": {
                        "type": "integer",
                        "description": "ID do cartão. Obs: Caso seja passado o ID, os outros campos do objeto card são dispensáveis.",
                        "format": "int32"
                      },
                      "hash": {
                        "type": "string",
                        "description": "Hash do cartão. Obs: A hash é válida por apenas 5 minutos. Não a armazene em seu banco de dados. Caso seja passado a hash, os outros campos do objeto card são dispensáveis."
                      },
                      "number": {
                        "type": "string",
                        "description": "Número do cartão."
                      },
                      "holderName": {
                        "type": "string",
                        "description": "Nome do portador do cartão."
                      },
                      "expirationMonth": {
                        "type": "integer",
                        "description": "Mês de expiração.",
                        "format": "int32"
                      },
                      "expirationYear": {
                        "type": "integer",
                        "description": "Ano de expiração.",
                        "format": "int32"
                      },
                      "cvv": {
                        "type": "string",
                        "description": "CVV do cartão."
                      }
                    }
                  },
                  "installments": {
                    "type": "integer",
                    "description": "Quantidade de parcelas. **Obrigatório** caso **paymentMethod** seja **credit_card**.",
                    "format": "int32"
                  },
                  "customer": {
                    "type": "object",
                    "description": "Dados do cliente.",
                    "required": [
                      "name",
                      "email"
                    ],
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "ID do cliente previamente criado. Não é necessário informar os outros campos caso o ID esteja preenchido."
                      },
                      "name": {
                        "type": "string",
                        "description": "Nome do cliente."
                      },
                      "email": {
                        "type": "string",
                        "description": "E-mail do cliente."
                      },
                      "document": {
                        "type": "object",
                        "description": "Documento do cliente.",
                        "required": [
                          "number",
                          "type"
                        ],
                        "properties": {
                          "number": {
                            "type": "string",
                            "description": "Número do documento."
                          },
                          "type": {
                            "type": "string",
                            "description": "Tipo do documento. Valores possíveis: cpf, cnpj"
                          }
                        }
                      },
                      "phone": {
                        "type": "string",
                        "description": "Telefone do cliente. Deve ser passado no formato 1199999999."
                      },
                      "externalRef": {
                        "type": "string",
                        "description": "Referência do cliente em sua API."
                      }
                    }
                  },
                  "shipping": {
                    "type": "object",
                    "description": "Dados de entrega.",
                    "required": [
                      "fee"
                    ],
                    "properties": {
                      "fee": {
                        "type": "integer",
                        "description": "Taxa de entrega. **Não é cobrada a mais no valor total da transação.**",
                        "format": "int32"
                      },
                      "address": {
                        "type": "object",
                        "description": "Endereço de entrega.",
                        "required": [
                          "street",
                          "streetNumber",
                          "zipCode",
                          "neighborhood",
                          "city",
                          "state",
                          "country"
                        ],
                        "properties": {
                          "street": {
                            "type": "string",
                            "description": "Rua"
                          },
                          "streetNumber": {
                            "type": "string",
                            "description": "Número"
                          },
                          "complement": {
                            "type": "string",
                            "description": "Complemento"
                          },
                          "zipCode": {
                            "type": "string",
                            "description": "CEP"
                          },
                          "neighborhood": {
                            "type": "string",
                            "description": "Bairro"
                          },
                          "city": {
                            "type": "string",
                            "description": "Cidade"
                          },
                          "state": {
                            "type": "string",
                            "description": "Estado (2 dígitos em letra maiúscula, exemplo: **SP**)"
                          },
                          "country": {
                            "type": "string",
                            "description": "País (2 dígitos, exemplo: **br**)"
                          }
                        }
                      }
                    }
                  },
                  "items": {
                    "type": "array",
                    "description": "Lista de itens da transação.",
                    "items": {
                      "properties": {
                        "title": {
                          "type": "string",
                          "description": "Título do item."
                        },
                        "unitPrice": {
                          "type": "integer",
                          "description": "Preço unitário em centavos. Ex: R$ 5,00 = 500.",
                          "format": "int32"
                        },
                        "quantity": {
                          "type": "integer",
                          "description": "Quantidade do item na transação.",
                          "format": "int32"
                        },
                        "tangible": {
                          "type": "boolean",
                          "description": "Se o item é físico."
                        },
                        "externalRef": {
                          "type": "string",
                          "description": "Referência do item em sua API."
                        }
                      },
                      "required": [
                        "title",
                        "unitPrice",
                        "quantity",
                        "tangible"
                      ],
                      "type": "object"
                    }
                  },
                  "boleto": {
                    "type": "object",
                    "description": "Informações sobre a expiração do boleto.",
                    "properties": {
                      "expiresInDays": {
                        "type": "integer",
                        "description": "Tempo de expiração do boleto em dias.",
                        "format": "int32"
                      }
                    }
                  },
                  "pix": {
                    "type": "object",
                    "description": "Informações sobre a expiração do PIX.",
                    "properties": {
                      "expiresInDays": {
                        "type": "integer",
                        "description": "Tempo de expiração do PIX em dias.",
                        "format": "int32"
                      }
                    }
                  },
                  "postbackUrl": {
                    "type": "string",
                    "description": "URL em sua API que receberá atualizações da transação."
                  },
                  "metadata": {
                    "type": "string",
                    "description": "Metadados para facilitar a visualização e controle das transações."
                  },
                  "traceable": {
                    "type": "boolean",
                    "description": "Se o status de entrega será gerenciado pelo painel. O padrão é **false**"
                  },
                  "ip": {
                    "type": "string",
                    "description": "IP do cliente."
                  },
                  "splits": {
                    "type": "array",
                    "description": "Regras de divisão da transação.",
                    "items": {
                      "properties": {
                        "recipientId": {
                          "type": "integer",
                          "description": "ID do recebedor.",
                          "format": "int32"
                        },
                        "amount": {
                          "type": "integer",
                          "description": "Valor da transação em centavos.",
                          "format": "int32"
                        },
                        "chargeProcessingFee": {
                          "type": "boolean",
                          "description": "Se o recebedor será cobrado das taxas da criação da transação. Default ```true``` para todos os recebedores da transação."
                        }
                      },
                      "required": [
                        "recipientId",
                        "amount"
                      ],
                      "type": "object"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "200",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{\n\t\"id\": 282,\n\t\"amount\": 10000,\n\t\"refundedAmount\": 0,\n\t\"companyId\": 2,\n\t\"installments\": 12,\n\t\"paymentMethod\": \"credit_card\",\n\t\"status\": \"paid\",\n\t\"postbackUrl\": null,\n\t\"metadata\": null,\n\t\"traceable\": false,\n\t\"secureId\": \"a4594817-be48-4a23-81aa-4bb01f95fe78\",\n\t\"secureUrl\": \"https://link.compra.com.br/pagar/a4594817-be48-4a23-81aa-4bb01f95fe78\",\n\t\"createdAt\": \"2022-07-18T09:54:22.000Z\",\n\t\"updatedAt\": \"2022-07-18T09:54:22.000Z\",\n\t\"paidAt\": \"2022-07-18T09:54:22.000Z\",\n\t\"ip\": null,\n\t\"externalRef\": null,\n\t\"customer\": {\n\t\t\"id\": 1,\n\t\t\"externalRef\": null,\n\t\t\"name\": \"Gabryel\",\n\t\t\"email\": \"gabryel@hotmail.com\",\n\t\t\"phone\": \"11999999999\",\n\t\t\"birthdate\": null,\n\t\t\"createdAt\": \"2022-05-26T19:17:48.000Z\",\n\t\t\"document\": {\n\t\t\t\"number\": \"12345678910\",\n\t\t\t\"type\": \"cpf\"\n\t\t},\n\t\t\"address\": {\n\t\t\t\"street\": \"Rua República Argentina\",\n\t\t\t\"streetNumber\": \"4214\",\n\t\t\t\"complement\": null,\n\t\t\t\"zipCode\": \"11065030\",\n\t\t\t\"neighborhood\": \"Pompéia\",\n\t\t\t\"city\": \"Santos\",\n\t\t\t\"state\": \"SP\",\n\t\t\t\"country\": \"BR\"\n\t\t}\n\t},\n\t\"card\": {\n\t\t\"id\": 147,\n\t\t\"brand\": \"visa\",\n\t\t\"holderName\": \"GABRYEL FERREIRA\",\n\t\t\"lastDigits\": \"1111\",\n\t\t\"expirationMonth\": 3,\n\t\t\"expirationYear\": 2028,\n\t\t\"reusable\": true,\n\t\t\"createdAt\": \"2022-07-17T18:08:11.000Z\"\n\t},\n\t\"boleto\": null,\n\t\"pix\": null,\n\t\"shipping\": null,\n\t\"refusedReason\": null,\n\t\"items\": [\n\t\t{\n\t\t\t\"externalRef\": null,\n\t\t\t\"title\": \"b456\",\n\t\t\t\"unitPrice\": 100,\n\t\t\t\"quantity\": 1,\n\t\t\t\"tangible\": false\n\t\t}\n\t],\n\t\"splits\": [\n\t\t{\n\t\t\t\"recipientId\": 1,\n\t\t\t\"amount\": 10000,\n\t\t\t\"netAmount\": 9400\n\t\t}\n\t],\n\t\"refunds\": [],\n\t\"delivery\": null,\n\t\"fee\": {\n\t\t\"fixedAmount\": 200,\n\t\t\"spreadPercentage\": 4,\n\t\t\"estimatedFee\": 600,\n\t\t\"netAmount\": 9400\n\t}\n}"
                  }
                },
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "integer",
                      "example": 282,
                      "default": 0
                    },
                    "amount": {
                      "type": "integer",
                      "example": 10000,
                      "default": 0
                    },
                    "refundedAmount": {
                      "type": "integer",
                      "example": 0,
                      "default": 0
                    },
                    "companyId": {
                      "type": "integer",
                      "example": 2,
                      "default": 0
                    },
                    "installments": {
                      "type": "integer",
                      "example": 12,
                      "default": 0
                    },
                    "paymentMethod": {
                      "type": "string",
                      "example": "credit_card"
                    },
                    "status": {
                      "type": "string",
                      "example": "paid"
                    },
                    "postbackUrl": {},
                    "metadata": {},
                    "traceable": {
                      "type": "boolean",
                      "example": false,
                      "default": true
                    },
                    "secureId": {
                      "type": "string",
                      "example": "a4594817-be48-4a23-81aa-4bb01f95fe78"
                    },
                    "secureUrl": {
                      "type": "string",
                      "example": "https://link.compra.com.br/pagar/a4594817-be48-4a23-81aa-4bb01f95fe78"
                    },
                    "createdAt": {
                      "type": "string",
                      "example": "2022-07-18T09:54:22.000Z"
                    },
                    "updatedAt": {
                      "type": "string",
                      "example": "2022-07-18T09:54:22.000Z"
                    },
                    "paidAt": {
                      "type": "string",
                      "example": "2022-07-18T09:54:22.000Z"
                    },
                    "ip": {},
                    "externalRef": {},
                    "customer": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "integer",
                          "example": 1,
                          "default": 0
                        },
                        "externalRef": {},
                        "name": {
                          "type": "string",
                          "example": "Gabryel"
                        },
                        "email": {
                          "type": "string",
                          "example": "gabryel@hotmail.com"
                        },
                        "phone": {
                          "type": "string",
                          "example": "11999999999"
                        },
                        "birthdate": {},
                        "createdAt": {
                          "type": "string",
                          "example": "2022-05-26T19:17:48.000Z"
                        },
                        "document": {
                          "type": "object",
                          "properties": {
                            "number": {
                              "type": "string",
                              "example": "12345678910"
                            },
                            "type": {
                              "type": "string",
                              "example": "cpf"
                            }
                          }
                        },
                        "address": {
                          "type": "object",
                          "properties": {
                            "street": {
                              "type": "string",
                              "example": "Rua República Argentina"
                            },
                            "streetNumber": {
                              "type": "string",
                              "example": "4214"
                            },
                            "complement": {},
                            "zipCode": {
                              "type": "string",
                              "example": "11065030"
                            },
                            "neighborhood": {
                              "type": "string",
                              "example": "Pompéia"
                            },
                            "city": {
                              "type": "string",
                              "example": "Santos"
                            },
                            "state": {
                              "type": "string",
                              "example": "SP"
                            },
                            "country": {
                              "type": "string",
                              "example": "BR"
                            }
                          }
                        }
                      }
                    },
                    "card": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "integer",
                          "example": 147,
                          "default": 0
                        },
                        "brand": {
                          "type": "string",
                          "example": "visa"
                        },
                        "holderName": {
                          "type": "string",
                          "example": "GABRYEL FERREIRA"
                        },
                        "lastDigits": {
                          "type": "string",
                          "example": "1111"
                        },
                        "expirationMonth": {
                          "type": "integer",
                          "example": 3,
                          "default": 0
                        },
                        "expirationYear": {
                          "type": "integer",
                          "example": 2028,
                          "default": 0
                        },
                        "reusable": {
                          "type": "boolean",
                          "example": true,
                          "default": true
                        },
                        "createdAt": {
                          "type": "string",
                          "example": "2022-07-17T18:08:11.000Z"
                        }
                      }
                    },
                    "boleto": {},
                    "pix": {},
                    "shipping": {},
                    "refusedReason": {},
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "externalRef": {},
                          "title": {
                            "type": "string",
                            "example": "b456"
                          },
                          "unitPrice": {
                            "type": "integer",
                            "example": 100,
                            "default": 0
                          },
                          "quantity": {
                            "type": "integer",
                            "example": 1,
                            "default": 0
                          },
                          "tangible": {
                            "type": "boolean",
                            "example": false,
                            "default": true
                          }
                        }
                      }
                    },
                    "splits": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "recipientId": {
                            "type": "integer",
                            "example": 1,
                            "default": 0
                          },
                          "amount": {
                            "type": "integer",
                            "example": 10000,
                            "default": 0
                          },
                          "netAmount": {
                            "type": "integer",
                            "example": 9400,
                            "default": 0
                          }
                        }
                      }
                    },
                    "refunds": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {}
                      }
                    },
                    "delivery": {},
                    "fee": {
                      "type": "object",
                      "properties": {
                        "fixedAmount": {
                          "type": "integer",
                          "example": 200,
                          "default": 0
                        },
                        "spreadPercentage": {
                          "type": "integer",
                          "example": 4,
                          "default": 0
                        },
                        "estimatedFee": {
                          "type": "integer",
                          "example": 600,
                          "default": 0
                        },
                        "netAmount": {
                          "type": "integer",
                          "example": 9400,
                          "default": 0
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "400",
            "content": {
              "application/json": {
                "examples": {
                  "Result": {
                    "value": "{}"
                  }
                },
                "schema": {
                  "type": "object",
                  "properties": {}
                }
              }
            }
          }
        },
        "deprecated": false
      }
    }
  },
  "x-readme": {
    "headers": [],
    "explorer-enabled": true,
    "proxy-enabled": true
  },
  "x-readme-fauxas": true,
  "_id": "6903c3030146e106032cec07:6903c3030146e106032cec0b