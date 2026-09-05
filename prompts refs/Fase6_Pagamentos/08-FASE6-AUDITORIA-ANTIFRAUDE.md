# VORIXA, FASE 6.8: AUDITORIA ANTIFRAUDE E TESTES ADVERSARIAIS

## OBJETIVO

Antes de considerar pagamentos prontos, tentar quebrar o sistema.

## TESTES OBRIGATÓRIOS

### Checkout

- preço adulterado;
- pacote adulterado;
- créditos adulterados;
- userId adulterado;
- moeda adulterada;
- desconto adulterado;
- checkout duplicado.

### Webhook

- assinatura inválida;
- evento duplicado;
- evento fora de ordem;
- pagamento inexistente;
- valor divergente;
- pacote divergente;
- usuário divergente;
- ambiente divergente;
- replay de evento.

### Créditos

- concessão dupla;
- estorno duplo;
- concorrência;
- saldo negativo;
- ajuste administrativo não autorizado.

### Acesso

- USER acessando funções ADMIN;
- usuário A acessando pagamento do usuário B;
- IDOR;
- mass assignment;
- alteração de status pelo frontend.

### Concorrência

Usar Promise.all para simular operações simultâneas controladas.

O teste deve provar que somente uma operação válida produz efeito financeiro.

## FALSO POSITIVO

Para cada teste crítico, verificar:

- o teste executa código real?
- existe mock?
- o mock pode esconder a falha?
- o teste falharia se a proteção fosse removida?
- a assertion realmente verifica a regra?

PASS no Vitest sozinho não aprova segurança.

## PENDING_TESTS

Tudo que depender de provedor real, webhook público, credenciais, domínio, sandbox ou produção deve ser registrado.

Não remover pendências existentes.

## ENTREGA

Criar:

docs/security_audit_phase6_payments.md

Executar suíte completa e build.

Parar e aguardar análise.
