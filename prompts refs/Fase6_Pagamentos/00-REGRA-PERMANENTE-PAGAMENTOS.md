# VORIXA, REGRA PERMANENTE PARA PAGAMENTOS

Esta regra deve permanecer válida durante toda a Fase 6 e fases posteriores.

## FINANCEIRO

Nunca confiar no frontend para:

- valor;
- status;
- créditos;
- userId;
- custo;
- desconto;
- moeda;
- confirmação de pagamento.

## IDEMPOTÊNCIA

Toda operação financeira que possa ser repetida deve possuir proteção contra duplicidade.

## LEDGER

Não apagar movimentações financeiras para "corrigir" histórico.

Correções devem gerar novas movimentações auditáveis.

## CONCORRÊNCIA

Toda operação que altere saldo, crédito ou estado financeiro deve ser segura contra concorrência.

## WEBHOOK

Webhook validado pelo provedor é diferente de request do cliente.

## MOBILE

Toda tela financeira deve ser funcional no celular, não apenas responsiva.

## PENDÊNCIAS

docs/PENDING_TESTS.md é acumulativo.

Nunca apagar pendência sem evidência de conclusão.

## TESTES

Nunca usar apenas "X/X testes passando" como prova de segurança.

Validar se os testes realmente exercitam o código e detectariam regressões.

## PRODUÇÃO

Nenhuma integração financeira é considerada homologada enquanto não houver evidência no ambiente real ou sandbox oficial apropriado.
