# VORIXA, FASE 6: PAGAMENTOS E CICLO FINANCEIRO

## OBJETIVO

Implementar a infraestrutura financeira do VORIXA com segurança transacional, idempotência, reconciliação, auditoria e separação absoluta entre:

- preço pago pelo cliente;
- créditos concedidos;
- custo estimado do provedor de IA;
- margem da plataforma.

## REGRAS GLOBAIS

1. Não confiar em valores financeiros enviados pelo frontend.
2. Nenhum pagamento pode conceder créditos apenas porque o frontend informou sucesso.
3. Webhook é fonte de verdade do status do pagamento, conforme o provedor escolhido.
4. Toda operação financeira crítica deve ser idempotente.
5. Estados financeiros não podem regredir indevidamente.
6. Cancelamento, falha, estorno e chargeback devem possuir estados explícitos.
7. Nunca creditar duas vezes o mesmo pagamento.
8. Nunca debitar créditos duas vezes pelo mesmo Job.
9. Não apagar histórico financeiro.
10. Ledger financeiro deve ser auditável.
11. Toda pendência que depender de credenciais, sandbox, domínio, webhook público ou produção deve entrar no docs/PENDING_TESTS.md.
12. Pendência só pode ser removida com evidência real.
13. Toda tela deve ser mobile-first e funcional no celular. Tabelas complexas devem virar cards/listas no mobile.
14. Não afirmar que pagamento está homologado apenas porque testes unitários passaram.
15. Cada etapa deve terminar com testes, build e relatório antes da próxima.

## ORDEM

Executar em pequenas etapas:

1. Arquitetura financeira e estados
2. Modelo de dados e ledger
3. Catálogo de produtos, créditos e preços
4. Abstração do provedor de pagamento
5. Checkout e criação de pagamento
6. Webhooks e idempotência
7. Estorno, cancelamento e reconciliação
8. Painel administrativo financeiro
9. Auditoria antifraude e validação de testes
10. Consolidação da Fase 6

NÃO executar todas as etapas em um único prompt.

## PARÂMETROS DE NEGÓCIO

Não inventar preços finais.

O administrador deverá conseguir configurar, quando previsto:

- pacotes;
- quantidade de créditos;
- preço;
- promoção;
- status ativo/inativo;
- custo estimado do provedor;
- margem estimada.

Qualquer preço não definido deve permanecer configurável, não hardcoded arbitrariamente.

## SAÍDA OBRIGATÓRIA DE CADA ETAPA

Criar ou atualizar documentação técnica.

Executar testes relevantes.

Executar a suíte completa quando possível.

Executar npm run build.

Informar números reais de testes.

Classificar controles como TESTADO, INSPECIONADO, NÃO APLICÁVEL ou PENDENTE.

Atualizar docs/PENDING_TESTS.md sem remover pendências existentes.

Parar ao final de cada etapa e aguardar autorização.
