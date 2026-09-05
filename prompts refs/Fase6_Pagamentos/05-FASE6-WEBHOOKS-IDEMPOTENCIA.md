# VORIXA, FASE 6.5: WEBHOOKS, IDEMPOTÊNCIA E ESTADOS

## OBJETIVO

Implementar o ponto mais crítico do ciclo financeiro: receber confirmação externa sem permitir crédito duplicado ou fraude.

## WEBHOOK

Validar assinatura conforme documentação oficial do provedor.

Não confiar em:

- body enviado pelo frontend;
- status informado pelo cliente;
- preço enviado pelo cliente;
- quantidade de créditos enviada pelo cliente.

## IDEMPOTÊNCIA

O mesmo evento deve ser processado uma única vez.

Testar:

- webhook duplicado;
- webhook simultâneo;
- webhook fora de ordem;
- webhook de pagamento inexistente;
- webhook de outro ambiente;
- assinatura inválida;
- payload inválido;
- evento já estornado.

## ESTADOS

Bloquear regressões inválidas.

Exemplo:

PAID -> PROCESSING não permitido.

REFUNDED -> PAID não permitido sem regra explícita e auditável.

## CRÉDITOS

Somente evento financeiro validado e elegível pode conceder créditos.

A concessão deve ser atômica e idempotente.

## TESTES ADVERSARIAIS

Criar testes que tentem:

- chamar webhook diretamente sem assinatura;
- repetir evento;
- alterar valor;
- alterar userId;
- alterar pacote;
- alterar moeda;
- enviar status PAID sem pagamento correspondente;
- enviar evento fora de ordem.

Não considerar teste PASS se ele não executa o código real do webhook.

## LIVE

Se a assinatura depender de segredo real, sandbox ou endpoint público, registrar em PENDING_TESTS.md.

Testes locais não devem ser apresentados como homologação do provedor real.

Parar.
