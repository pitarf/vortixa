# VORIXA, FASE 6.4: ABSTRAÇÃO DO PROVEDOR E CHECKOUT

## OBJETIVO

Criar uma camada desacoplada do provedor de pagamento.

## REGRA

Não acoplar regras financeiras diretamente aos componentes React.

Criar interface de provider com operações necessárias, por exemplo:

- criar checkout;
- consultar pagamento;
- validar evento;
- solicitar estorno;
- consultar estorno.

Os nomes finais devem seguir o projeto.

## PROVEDOR

Se o provedor definitivo ainda não estiver escolhido, implementar apenas a abstração e um adapter mock.

Não inventar credenciais.

Não colocar secret no frontend.

## CHECKOUT

O servidor deve determinar:

- usuário;
- pacote;
- preço oficial;
- quantidade de créditos;
- moeda;
- referência interna.

O cliente não pode enviar:

- preço;
- creditAmount;
- providerCost;
- userId de terceiros;
- status pago.

O backend deve ignorar/rejeitar manipulação desses campos.

## TESTES

Testar:

- preço adulterado;
- pacote adulterado;
- userId adulterado;
- quantidade de créditos adulterada;
- checkout duplicado;
- usuário sem autenticação;
- pacote inativo.

## ENTREGA

Implementar adapter e checkout apenas no nível permitido pelo ambiente atual.

Dependências reais de sandbox/credenciais entram em PENDING_TESTS.md.

Testes + build.

Parar.
