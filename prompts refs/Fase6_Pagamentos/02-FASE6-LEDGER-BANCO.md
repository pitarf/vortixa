# VORIXA, FASE 6.2: BANCO, LEDGER E INTEGRIDADE TRANSACIONAL

## OBJETIVO

Implementar o modelo persistente necessário para o ciclo financeiro.

## REQUISITOS

O modelo deve permitir rastrear:

- paymentId externo;
- provider;
- userId;
- pedido;
- pacote comprado;
- valor monetário;
- moeda;
- créditos esperados;
- créditos realmente concedidos;
- status;
- timestamps;
- payload/evento externo quando necessário e seguro;
- referência de idempotência;
- estorno;
- auditoria.

## INTEGRIDADE

Adicionar constraints e índices adequados.

Garantir unicidade para identificadores externos apropriados.

Não confiar em unicidade apenas no código.

Concessão de créditos deve ocorrer na mesma transação lógica apropriada do evento confirmado.

Evitar saldo mutável sem histórico.

Preservar ledger.

## CONCORRÊNCIA

Criar testes de:

- dois webhooks iguais simultâneos;
- dois processos tentando conceder o mesmo pagamento;
- pagamento e estorno concorrentes;
- pagamentos diferentes do mesmo usuário simultâneos.

Usar transações e locks apropriados quando necessário.

## MIGRATIONS

Não usar db push para substituir migrations versionadas em alterações definitivas.

Criar migration real.

Validar aplicação em banco temporário limpo.

## ENTREGA

Criar migration.

Criar testes.

Atualizar documentação.

Atualizar PENDING_TESTS.md.

Executar npm test e npm run build.

Parar.
