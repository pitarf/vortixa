# VORIXA, FASE 6.1: ARQUITETURA FINANCEIRA E ESTADOS

## OBJETIVO

Antes de implementar pagamento, mapear o ciclo financeiro completo.

## ANALISAR

Definir entidades conceituais para:

- usuário;
- pacote de créditos;
- pedido;
- pagamento;
- transação financeira;
- concessão de créditos;
- estorno;
- cancelamento;
- chargeback, se suportado;
- promoção;
- auditoria.

Não alterar banco ainda sem necessidade.

## MÁQUINA DE ESTADOS

Definir estados inequívocos para pagamento, por exemplo:

PENDING
AUTHORIZED
PAID
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
CHARGEBACK

Os nomes finais devem seguir o provedor e o domínio do projeto, mas regressões de estado devem ser proibidas.

## REGRAS

- Frontend nunca define PAID.
- Frontend nunca define créditos concedidos.
- Webhook não pode reprocessar concessão.
- Mesmo evento recebido duas vezes deve produzir o mesmo resultado.
- Pagamento desconhecido não pode alterar saldo.
- Usuário não pode escolher outro userId no checkout.

## ENTREGA

Criar documento:

docs/PHASE6_FINANCIAL_ARCHITECTURE.md

Criar matriz de estados e transições.

Criar/atualizar PENDING_TESTS.md para dependências externas identificadas.

Não implementar checkout ainda.

Rodar testes e build.

Parar.
