# VORIXA, FECHAMENTO E VALIDAÇÃO FINAL DA FASE 4

A auditoria da Fase 4 foi concluída e o relatório técnico foi analisado.

A implementação está muito bem encaminhada, porém antes de considerar a Fase 4 definitivamente encerrada existem alguns pontos finais que precisam ser validados.

**Esta etapa NÃO autoriza a Fase 5.**

O objetivo é exclusivamente finalizar a validação da Fase 4.

---

# 1. VALIDAÇÃO COMPLETA DAS MIGRATIONS

O relatório informa que a migration:

`20260818042250_aijob_financial_snapshots`

foi criada e aplicada utilizando `prisma migrate resolve --applied`.

Antes de considerar a migration definitivamente validada, precisamos garantir que o histórico completo do banco seja reproduzível.

## Executar uma validação em banco PostgreSQL limpo

Criar ou utilizar uma instância/banco de desenvolvimento separado e vazio.

Executar TODAS as migrations versionadas do projeto desde o início.

Confirmar que:

```text
Migration inicial
↓
Migration Auth
↓
Migration Credits
↓
Migration AIJob
↓
Schema final
```

produz exatamente a estrutura esperada pelo `schema.prisma` atual.

Verificar:

- tabelas
- colunas
- tipos
- enums
- índices
- unique constraints
- foreign keys
- relacionamentos

Executar:

```bash
npx prisma migrate status
```

e os comandos adequados para validar o schema.

### IMPORTANTE

Não utilizar:

```bash
prisma db push --accept-data-loss
```

para essa validação.

O objetivo é comprovar que um banco novo consegue ser reconstruído exclusivamente pelas migrations versionadas.

Se houver qualquer divergência:

1. identificar;
2. corrigir;
3. criar/ajustar migration;
4. testar novamente.

Não apagar dados existentes.

---

# 2. WEBHOOK fal.ai, ASSINATURA INVÁLIDA

O relatório confirma que requests sem assinatura retornam HTTP 401.

Agora adicionar explicitamente o teste do cenário:

```text
x-fal-signature ausente
→ 401

x-fal-signature inválida
→ 401

x-fal-signature válida
→ processamento autorizado
```

A assinatura deve ser validada utilizando o mecanismo oficial/documentado da fal.ai.

Não implementar uma assinatura própria incompatível com o mecanismo oficial.

Também verificar:

- payload adulterado;
- assinatura adulterada;
- timestamp inválido, quando aplicável;
- replay, quando aplicável.

Registrar a decisão técnica em:

```text
/docs/SECURITY.md
```

---

# 3. CUSTO DO PROVEDOR X PREÇO DO VORIXA

Confirmar e documentar claramente a diferença entre:

```text
providerUnitCostUsd
```

e:

```text
creditCost
```

O primeiro representa o custo configurado/estimado do provedor.

O segundo representa quanto o VORIXA cobra em créditos do usuário.

Eles não podem ser tratados como a mesma informação.

Exemplo:

```text
Custo fal.ai:
US$ 0,126 / segundo

VORIXA:
12 créditos / segundo
```

---

# 4. SNAPSHOT FINANCEIRO

Confirmar que, no momento da criação do AIJob, os valores relevantes são preservados.

Exemplo:

```text
AIModel
providerUnitCostUsd = 0.126
creditCost = 12
```

AIJob:

```text
providerUnitCostUsd = 0.126
billingQuantity = 10
providerCostUsd = 1.26
creditsCharged = 120
```

Se posteriormente o administrador alterar:

```text
providerUnitCostUsd = 0.150
creditCost = 15
```

o Job antigo NÃO pode ser alterado.

Isso é obrigatório para preservar histórico financeiro.

---

# 5. NÃO IMPLEMENTAR PRICING AUTOMÁTICO NESTA FASE

Não implementar neste momento sincronização automática dos preços da fal.ai.

O modelo atual deverá permanecer:

```text
AIModel
↓
Preço configurado pelo VORIXA
↓
AIJob snapshot
```

No futuro poderemos criar uma rotina administrativa para consultar pricing/usage da fal.ai.

Essa funcionalidade não faz parte desta etapa.

Registrar como melhoria futura em:

```text
/docs/ROADMAP.md
```

---

# 6. GIT

O relatório informou:

```text
fatal: not a git repository
```

Isso precisa ser investigado.

O projeto possui o repositório oficial:

```text
https://github.com/pitarf/vorixa.git
```

Verificar se o workspace atual é realmente:

```text
C:\Git\React\VORIXA
```

e se o `.git` está presente.

Executar:

```bash
git status
git remote -v
git branch --show-current
```

Se o repositório ainda não estiver inicializado/conectado:

- não apagar arquivos;
- não sobrescrever código;
- não fazer push automaticamente;
- não criar outro repositório remoto;
- não alterar o repositório GitHub existente.

Se for necessário inicializar/configurar o Git local, preparar a configuração e informar exatamente o que foi feito.

### IMPORTANTE

Não executar:

```bash
git push
```

sem autorização explícita.

---

# 7. COMMIT DA FASE 4

Se o Git local estiver corretamente configurado e houver alterações ainda não commitadas:

preparar um commit específico da Fase 4.

Sugestão:

```text
feat: implementacao do motor de IA e integracao falai
```

Antes do commit:

```bash
git status
git diff
```

Verificar cuidadosamente:

- `.env`
- secrets
- FAL_KEY
- uploads
- arquivos temporários
- build
- arquivos desnecessários

Nenhuma credencial pode entrar no commit.

Não fazer push sem autorização.

---

# 8. TESTES FINAIS

Após as correções, executar novamente:

```text
Vitest
Build Next.js
Prisma validation
```

A suíte deve continuar passando.

Além dos testes existentes, confirmar explicitamente:

### Webhook

```text
sem assinatura → 401
assinatura inválida → 401
assinatura válida → processamento
```

### Idempotência

```text
1 request → 1 Job
2 requests simultâneos → 1 Job
10 requests simultâneos → 1 Job
```

### Webhook

```text
COMPLETED
COMPLETED
→ 1 output
```

### Ordem

```text
PROCESSING
COMPLETED
PROCESSING
→ COMPLETED
```

### Refund

```text
FAILED
FAILED
→ 1 refund
```

### Mock

```text
AI_PROVIDER_MODE=mock
→ zero chamadas reais à fal.ai
```

---

# 9. BUILD

Executar novamente o build de produção.

Confirmar:

```text
npm run build
```

Sem erros.

Se houver warnings relevantes relacionados à Fase 4, registrar no relatório.

---

# 10. DOCUMENTAÇÃO

Atualizar somente se necessário:

```text
/docs/AI_INTEGRATIONS.md
/docs/DATABASE.md
/docs/CREDITS.md
/docs/SECURITY.md
/docs/TESTING.md
/docs/DECISIONS.md
/docs/ROADMAP.md
/docs/CHANGELOG.md
```

A documentação deve refletir exatamente o código existente.

Não declarar como implementada uma funcionalidade que ainda não existe.

---

# 11. RELATÓRIO FINAL

Após concluir tudo, gerar/atualizar:

```text
audit_report.md
```

O relatório final deve conter:

## 1. Migration Validation

Informar se um banco PostgreSQL vazio consegue ser reconstruído exclusivamente pelas migrations.

## 2. Webhook Security

Informar:

- assinatura ausente;
- assinatura inválida;
- assinatura válida.

## 3. Financial Snapshot

Mostrar como:

```text
provider cost
+
billing quantity
+
credits charged
```

são preservados no AIJob.

## 4. Git

Informar:

- status;
- branch;
- remote;
- commit;
- arquivos não rastreados;
- confirmação de que secrets não estão versionados.

## 5. Tests

Informar resultado completo.

## 6. Build

Informar resultado.

## 7. Documentation

Informar arquivos atualizados.

## 8. Remaining Risks

Informar qualquer risco ainda existente.

---

# 12. CRITÉRIO FINAL

A Fase 4 será considerada definitivamente encerrada se:

- migrations reproduzirem o banco corretamente;
- não houver dependência de `db push --accept-data-loss`;
- webhook validar assinatura ausente;
- webhook validar assinatura inválida;
- webhook aceitar assinatura válida;
- idempotência estiver protegida;
- refunds estiverem protegidos;
- snapshot financeiro estiver funcionando;
- custo do provedor estiver separado dos créditos do VORIXA;
- Mock Mode não gerar chamadas reais;
- FAL_KEY estiver protegida;
- Storage estiver funcionando;
- testes passarem;
- build passar;
- documentação estiver atualizada.

---

# 13. NÃO INICIAR A FASE 5

Mesmo que todos os testes passem:

**NÃO iniciar a Fase 5.**

Não criar novas ferramentas de IA.

Não criar novas interfaces de geração.

Não integrar pagamentos.

Não implementar marketplace.

Não implementar funcionalidades adicionais.

Apenas finalizar a validação da Fase 4.

Ao final, responder:

```text
FASE 4 PRONTA PARA APROVAÇÃO
```

ou:

```text
FASE 4 AINDA POSSUI PENDÊNCIAS
```

A decisão de iniciar a Fase 5 será feita posteriormente mediante autorização explícita.