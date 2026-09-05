# VORIXA, FASE 6.6: ESTORNO, CANCELAMENTO, CHARGEBACK E RECONCILIAÇÃO

## OBJETIVO

Garantir que o ciclo financeiro continue seguro depois da compra.

## ESTORNO

Definir:

- estorno total;
- estorno parcial, se suportado;
- quem pode solicitar;
- quando créditos devem ser revertidos;
- como impedir estorno duplicado.

Nunca apagar a transação original.

Criar nova movimentação no ledger.

## CANCELAMENTO

Diferenciar:

- pedido cancelado antes do pagamento;
- pagamento falhado;
- pagamento confirmado;
- estorno após confirmação.

## CHARGEBACK

Se suportado pelo provedor, definir estado e impacto financeiro.

Não inventar integração caso o provedor não forneça esse evento.

## RECONCILIAÇÃO

Criar mecanismo para comparar:

pagamentos externos
VS
registros internos
VS
créditos concedidos

Identificar:

- pagamento sem pedido;
- pedido sem pagamento;
- pagamento pago sem crédito;
- crédito sem pagamento;
- duplicidade;
- divergência de valor.

## ADMIN

A reconciliação deve ser auditável.

Ajustes manuais devem exigir permissão administrativa e gerar registro.

## TESTES

Testar:

- estorno duplo;
- estorno concorrente;
- pagamento + estorno concorrentes;
- crédito já consumido;
- estorno parcial;
- chargeback, se aplicável.

Atualizar PENDING_TESTS.md.

Parar.
