# VORIXA, AUDITORIA E CORREÇÃO DA FASE 4

A Fase 4 foi reportada como concluída, porém **NÃO está autorizada a Fase 5 neste momento**.

Antes de qualquer nova funcionalidade, deverá ser realizada uma auditoria técnica completa da implementação da Fase 4.

Esta etapa NÃO é uma nova fase de desenvolvimento.

É uma etapa de:

**Auditoria → Identificação de gaps → Correção → Testes → Validação.**

Não iniciar ferramentas adicionais de IA, novas telas ou funcionalidades da Fase 5.

---

# 1. OBJETIVO

Auditar a implementação real da Fase 4 no código-fonte e verificar se ela atende integralmente ao Prompt:

`10- VORIXA, Autorização da Fase 4, Integração fal.ai e Motor de IA.md`

Não considerar apenas o relatório anterior como evidência de implementação.

A fonte de verdade para esta auditoria deverá ser:

1. Código existente
2. Schema Prisma
3. Migrations
4. Testes
5. Configurações
6. Documentação
7. Git diff
8. Comportamento real da aplicação

---

# 2. REGRA DE CLASSIFICAÇÃO

Para cada requisito do Prompt 10, classificar como:

```text
PASSOU
```

Implementado corretamente e validado.

```text
PARCIAL
```

Existe implementação, mas falta algum requisito.

```text
NÃO IMPLEMENTADO
```

Não existe implementação suficiente.

```text
INCORRETO
```

Existe implementação, porém está tecnicamente inadequada ou viola as regras do projeto.

```text
NÃO APLICÁVEL
```

Somente quando houver justificativa técnica clara.

Não marcar um item como PASSOU apenas porque existe um arquivo ou função com nome semelhante.

---

# 3. MATRIZ DE AUDITORIA

Criar uma matriz completa:

| Requisito | Status | Evidência | Problema | Correção |
|---|---|---|---|---|
| Provider abstraction | | | | |
| Mock provider | | | | |
| Live provider | | | | |
| AIService | | | | |
| CreditService | | | | |
| Idempotência | | | | |
| Webhook | | | | |
| Webhook security | | | | |
| Storage | | | | |
| AIJob | | | | |
| Financial snapshot | | | | |
| Provider cost | | | | |
| Credit cost | | | | |
| Retry | | | | |
| Timeout | | | | |
| Rate limiting | | | | |
| User unlimited | | | | |
| Mobile UX | | | | |
| Mock mode | | | | |
| Tests | | | | |
| Documentation | | | | |

A matriz deverá contemplar TODOS os requisitos relevantes do Prompt 10, não apenas os exemplos acima.

---

# 4. PRIORIDADE CRÍTICA: PRISMA

O relatório anterior informou que foi utilizado:

```text
prisma db push --accept-data-loss
```

Isso precisa ser investigado imediatamente.

## 4.1 Não utilizar `db push --accept-data-loss` como fluxo normal

O projeto utiliza migrations versionadas.

Portanto, alterações estruturais da Fase 4 deverão possuir migration própria.

Auditar:

- Schema atual
- Histórico de migrations
- Estado real do banco
- Alterações introduzidas pelo `db push`
- Possíveis diferenças entre schema e migrations

## 4.2 Recuperar migration

Se as alterações ainda não possuem migration versionada:

1. Identificar exatamente todas as alterações.
2. Criar migration adequada.
3. Validar a migration em banco de desenvolvimento.
4. Confirmar que nenhum dado existente foi perdido.
5. Executar os testes novamente.

Não utilizar novamente:

```text
prisma db push --accept-data-loss
```

para corrigir o problema.

## 4.3 Dados existentes

Verificar se as migrations da Fase 1, 2 e 3 continuam intactas.

Não apagar ou recriar tabelas existentes sem necessidade.

Se houver risco de perda de dados, interromper a correção e informar.

---

# 5. AUDITORIA DO AIService

Inspecionar o código real do:

```text
ai.service.ts
```

Verificar:

- autenticação
- autorização
- ferramenta ativa
- modelo ativo
- parâmetros
- validação Zod
- créditos
- idempotência
- criação de AIJob
- débito
- chamada ao provider
- tratamento de erro
- retry
- timeout
- refund
- logs

O AIService deve ser o orquestrador.

Não duplicar essas regras em API routes ou componentes.

---

# 6. AUDITORIA DO PROVIDER LAYER

Inspecionar:

```text
FalAIProvider
MockAIProvider
AIProviderFactory
```

Verificar se a abstração realmente funciona.

O código de negócio não deve depender diretamente da SDK da fal.ai.

O ideal deverá ser:

```text
AIService
   ↓
AIProvider interface
   ↓
FalAIProvider
```

ou:

```text
AIService
   ↓
AIProvider interface
   ↓
MockAIProvider
```

O `AIService` não deve precisar saber se está usando mock ou fal.ai.

---

# 7. MOCK MODE

Auditar:

```text
AI_PROVIDER_MODE=mock
```

Garantir que:

- nenhuma chamada real à fal.ai seja feita
- nenhuma `FAL_KEY` seja necessária
- testes possam rodar sem custo externo
- fluxo de webhook continue sendo exercitado
- máquina de estados continue sendo exercitada
- CreditService continue sendo utilizado
- StorageService continue sendo utilizado

IMPORTANTE:

O Mock não deve criar um caminho privilegiado que pule regras existentes no fluxo real.

Sempre que possível:

```text
Mock
↓
mesmo contrato
↓
mesmo webhook
↓
mesma máquina de estados
↓
mesmo processamento
```

---

# 8. AUDITORIA DA FAL_KEY

Verificar no projeto inteiro:

```text
FAL_KEY
```

Garantir que nunca esteja presente em:

- código frontend
- Client Components
- bundle público
- HTML
- documentação
- Git
- `.env.example`
- logs
- mensagens de erro

Verificar também se a configuração atual impede exposição acidental.

---

# 9. AUDITORIA DOS MODELOS

Confirmar quais modelos realmente foram implementados.

Verificar os endpoints diretamente no código e na documentação.

No MVP esperamos inicialmente:

### FLUX

```text
fal-ai/flux/dev
```

### Kling Motion Control

```text
fal-ai/kling-video/v3/standard/motion-control
```

### Seedance 2.0

Endpoints oficiais aplicáveis:

```text
bytedance/seedance-2.0/text-to-video
bytedance/seedance-2.0/image-to-video
bytedance/seedance-2.0/reference-to-video
```

### Sync

```text
fal-ai/sync-lipsync
```

### Upscaler

```text
fal-ai/video-upscaler
```

Se algum endpoint tiver sido alterado devido à documentação oficial atual da fal.ai, registrar a divergência em:

```text
/docs/DECISIONS.md
```

Não inventar ou manter endpoint obsoleto apenas para seguir este documento.

---

# 10. AUDITORIA DE CUSTOS

Verificar como o sistema calcula:

```text
providerUnitCostUsd
billingQuantity
providerCostUsd
```

Exemplo:

```text
US$ 0,126 / segundo
×
10 segundos
=
US$ 1,26
```

Confirmar que o cálculo é realizado corretamente.

Também verificar se a unidade é respeitada.

Exemplos:

```text
IMAGE
MEGAPIXEL
SECOND
MINUTE
REQUEST
```

Não assumir que todos os modelos são cobrados por geração.

---

# 11. SNAPSHOT FINANCEIRO

Verificar se o AIJob armazena os valores financeiros referentes à geração no momento em que ela ocorreu.

Devem existir, conforme aplicável:

```text
billingUnit
billingQuantity
providerUnitCostUsd
providerCostUsd
creditsReserved
creditsCharged
creditsRefunded
```

O histórico não pode depender do preço atual do modelo.

Exemplo:

Hoje:

```text
providerUnitCostUsd = 0.126
```

Amanhã:

```text
providerUnitCostUsd = 0.150
```

A geração antiga deve continuar com:

```text
0.126
```

---

# 12. PREÇO DO PROVEDOR X PREÇO DO VORIXA

Confirmar que existem duas informações independentes:

```text
Custo fal.ai
```

e:

```text
Créditos cobrados do usuário
```

Não misturar essas duas informações.

O administrador deverá futuramente poder alterar os créditos cobrados sem alterar o histórico de custos reais.

---

# 13. IDEMPOTÊNCIA DE GERAÇÃO

Testar especificamente:

### Cenário 1

Uma requisição.

Resultado:

```text
1 AIJob
```

### Cenário 2

Duas requisições simultâneas com a mesma idempotency key.

Resultado esperado:

```text
1 AIJob
```

### Cenário 3

10 requisições simultâneas.

Resultado esperado:

```text
1 AIJob
```

### Cenário 4

Refresh da página.

Não criar nova geração.

### Cenário 5

Retry de rede.

Não criar nova geração.

---

# 14. IDEMPOTÊNCIA NO BANCO

Não confiar apenas em:

```text
if (...)
```

no código.

Verificar se existe proteção adequada no banco:

- Unique constraint
- Unique index
- Transação
- Lock quando necessário

A proteção deve continuar funcionando mesmo em concorrência.

---

# 15. AUDITORIA DO WEBHOOK

Este é um requisito crítico.

Inspecionar:

```text
/api/webhooks/fal/route.ts
```

Confirmar:

1. Validação de autenticidade do webhook.
2. Validação do payload.
3. Identificação do provider.
4. Identificação do request.
5. Idempotência.
6. Validação do AIJob.
7. Validação do estado atual.
8. Transição de estado válida.
9. Processamento do resultado.
10. Atualização do Storage.
11. Atualização do AIJob.
12. Tratamento de erro.

Não considerar o webhook seguro apenas porque a rota é privada ou possui um endpoint difícil de adivinhar.

---

# 16. WEBHOOK DUPLICADO

Simular:

```text
Webhook COMPLETED
Webhook COMPLETED
```

Resultado:

- Apenas um processamento.
- Apenas um output.
- Nenhum crédito duplicado.
- Nenhum refund indevido.
- Nenhuma alteração inconsistente.

---

# 17. WEBHOOK FORA DE ORDEM

Testar:

```text
PROCESSING
COMPLETED
PROCESSING
```

Resultado final:

```text
COMPLETED
```

O último evento não pode regredir o Job.

Testar também:

```text
COMPLETED
FAILED
```

e outros estados inválidos.

Documentar a máquina de estados.

---

# 18. TIMEOUT

Testar:

```text
VORIXA
↓
fal.ai
↓
timeout local
```

O sistema não deve automaticamente criar uma segunda geração.

Deve verificar o estado do request quando tecnicamente possível.

Diferenciar:

```text
request desconhecido
```

de:

```text
request ainda processando
```

de:

```text
request concluído
```

de:

```text
request falhou
```

---

# 19. RETRY

Verificar se existe retry.

Caso exista:

- limite máximo
- backoff
- diferenciação entre erro transitório e permanente
- idempotência
- consulta do estado antes de reenviar

Nunca permitir retry infinito.

Se não existir retry nesta fase, documentar explicitamente essa decisão.

---

# 20. CRÉDITOS

Auditar a integração com:

```text
CreditService
```

Confirmar:

- saldo suficiente
- consumo
- reserva
- refund
- idempotência
- concorrência
- unlimited

Não criar uma segunda implementação de créditos.

---

# 21. FALHA E REFUND

Testar:

```text
Crédito debitado
↓
Provider falha
↓
AIJob FAILED
↓
REFUND
```

Garantir que:

- refund ocorre somente quando aplicável
- refund é idempotente
- refund gera `CreditTransaction`
- saldo não é alterado diretamente
- segundo webhook não gera segundo refund

---

# 22. STORAGE

Auditar:

```text
storage.service.ts
```

Verificar:

```text
fal.ai temporary URL
↓
download
↓
storage definitivo
```

Confirmar que o resultado final não depende permanentemente da URL temporária da fal.ai.

Validar:

### Desenvolvimento

```text
DiskStorageProvider
```

### Produção

```text
Cloudflare R2
```

A abstração deve permanecer independente da IA.

---

# 23. TESTES

Auditar os 18 testes reportados.

Não considerar "18/18" suficiente.

Mapear cada teste para um requisito.

Criar testes adicionais caso estejam faltando:

- webhook authentication
- webhook duplicate
- webhook out-of-order
- timeout
- retry
- provider cost calculation
- historical price snapshot
- concurrent idempotency
- no FAL call in mock mode
- secret exposure
- storage failure
- refund duplicate

---

# 24. TESTE REAL CONTROLADO

Não executar várias chamadas reais.

Se for necessário validar a integração real:

Executar somente um teste controlado e barato, com autorização explícita.

Registrar:

- modelo
- endpoint
- custo esperado
- custo real, se disponível
- request ID
- resultado
- storage
- webhook
- créditos
- refund, se aplicável

Não transformar testes reais em rotina automatizada.

---

# 25. MOBILE

A Fase 4 também criou/alterou elementos de interface.

Validar visualmente:

- Mobile pequeno
- Mobile grande
- Tablet
- Desktop

Verificar especialmente:

- Upload
- Seleção de modelo
- Formulários
- Botões
- Loading
- Resultado
- Download
- Compartilhamento
- Mensagens de erro

Uma interface não deve ser considerada aprovada apenas porque não possui overflow.

---

# 26. DESIGN SYSTEM

Verificar se as novas telas/components utilizam:

```text
Design Tokens
```

e não cores hardcoded.

Verificar:

- cores
- tipografia
- espaçamento
- radius
- estados
- botões
- inputs

Qualquer exceção deve ser documentada.

---

# 27. SEGURANÇA ZERO TRUST

Auditar todos os endpoints criados.

Confirmar:

- autenticação
- autorização
- validação Zod
- rate limiting
- ownership
- proteção de parâmetros
- proteção contra manipulação de créditos
- proteção contra manipulação de modelo
- proteção contra alteração de preço pelo cliente

O frontend nunca deve ser fonte de verdade para:

- preço
- custo
- créditos
- modelo ativo
- status do job
- pagamento

---

# 28. GIT

Executar:

```bash
git status
git diff
git log --oneline -n 10
```

Verificar:

- alterações não commitadas
- secrets
- arquivos `.env`
- uploads
- artefatos de build
- arquivos temporários

Confirmar que nenhuma credencial foi commitada.

O repositório oficial do projeto é:

```text
https://github.com/pitarf/vorixa.git
```

Não executar push automaticamente sem autorização.

---

# 29. DOCUMENTAÇÃO

Verificar:

```text
/docs/AI_INTEGRATIONS.md
/docs/DATABASE.md
/docs/CREDITS.md
/docs/API.md
/docs/SECURITY.md
/docs/TESTING.md
/docs/FILE_STORAGE.md
/docs/FRONTEND.md
/docs/ARCHITECTURE.md
/docs/DECISIONS.md
/docs/CHANGELOG.md
```

A documentação deve refletir o código real.

Não documentar funcionalidades inexistentes como concluídas.

---

# 30. CORREÇÕES

Depois de concluir a auditoria:

1. Apresentar a matriz de auditoria.
2. Identificar todos os itens PARCIAL, NÃO IMPLEMENTADO e INCORRETO.
3. Corrigir os problemas encontrados.
4. Criar migrations quando necessário.
5. Executar testes.
6. Executar build.
7. Executar auditoria novamente.
8. Atualizar documentação.

Não simplesmente marcar os itens como PASSOU sem evidência.

---

# 31. REGRA PARA ALTERAÇÕES DE BANCO

Após esta auditoria:

**Não utilizar `prisma db push --accept-data-loss` como método normal de evolução do banco.**

Todas as alterações estruturais deverão utilizar migrations versionadas.

Caso seja absolutamente necessário utilizar alguma ferramenta de sincronização para investigação local, isso deverá ser explicitamente documentado e não substituir a migration oficial.

---

# 32. CRITÉRIO DE APROVAÇÃO

A Fase 4 somente será considerada aprovada quando:

- Não houver item crítico PARCIAL.
- Não houver item crítico NÃO IMPLEMENTADO.
- Não houver item crítico INCORRETO.
- Migration estiver versionada.
- Webhook estiver protegido.
- Idempotência estiver validada.
- Concorrência estiver validada.
- Refund estiver validado.
- Snapshot financeiro estiver validado.
- Mock mode estiver validado.
- FAL_KEY estiver protegida.
- Storage estiver validado.
- Build passar.
- Testes passarem.
- Documentação estiver sincronizada.

---

# 33. NÃO INICIAR A FASE 5

Mesmo após corrigir tudo:

**NÃO iniciar a Fase 5.**

Não implementar novas ferramentas.

Não implementar novas telas de IA.

Não implementar marketplace.

Não implementar pagamentos.

Não implementar funcionalidades adicionais.

Aguardar minha autorização explícita.

---

# 34. RELATÓRIO FINAL

Ao terminar, apresentar obrigatoriamente:

## A. Resumo da auditoria

## B. Matriz completa de requisitos

## C. Problemas encontrados

## D. Correções realizadas

## E. Migrations

## F. Segurança do webhook

## G. Idempotência

## H. Concorrência

## I. Retry e timeout

## J. Créditos e refunds

## K. Cálculo de custos

## L. Snapshot financeiro

## M. Storage

## N. Testes

## O. Build

## P. Git status

## Q. Documentação

## R. Pendências

## S. Riscos conhecidos

## T. Conclusão

A conclusão deverá informar claramente:

```text
FASE 4 APROVADA TECNICAMENTE
```

ou:

```text
FASE 4 AINDA NÃO APROVADA
```

Não declarar aprovação apenas porque o build passou.

---

# 35. REGRA ABSOLUTA

O objetivo desta etapa é garantir que o VORIXA esteja tecnicamente preparado para começar a executar gerações reais de IA sem criar riscos desnecessários de:

- Cobrança duplicada
- Crédito duplicado
- Jobs duplicados
- Refund duplicado
- Webhook fraudulento
- Perda de dados
- Exposição de API Key
- Custos não controlados
- Dados financeiros inconsistentes

Somente depois que essa auditoria estiver concluída e aprovada poderemos iniciar a Fase 5.