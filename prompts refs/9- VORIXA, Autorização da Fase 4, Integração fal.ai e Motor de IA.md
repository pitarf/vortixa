# VORIXA, FASE 4: INTEGRAÇÃO fal.ai E MOTOR DE IA

A Fase 3 está aprovada.

As Diretrizes Globais de UX Mobile, Segurança Financeira, Zero Trust, Idempotência, Antifraude e Auditoria também estão aprovadas e devem ser respeitadas nesta fase.

Você está autorizado a iniciar a **Fase 4: Integração fal.ai e Motor de IA do VORIXA**.

Esta fase é crítica porque será responsável pelas primeiras operações reais que geram custo financeiro para a plataforma.

Não implementar integrações de maneira isolada ou diretamente nas telas.

Construir uma **camada de abstração de provedores de IA**, preparada para crescimento futuro e para inclusão de novos provedores/modelos sem reescrever a aplicação.

---

# 1. OBJETIVO

Construir o motor de geração de IA do VORIXA utilizando inicialmente a **fal.ai** como provedor.

O sistema deverá permitir:

- Selecionar ferramenta
- Selecionar modelo
- Validar parâmetros
- Calcular custo em créditos
- Verificar saldo
- Criar AIJob
- Garantir idempotência
- Enviar requisição para o provedor
- Acompanhar processamento
- Receber webhook
- Validar webhook
- Processar resultado
- Armazenar resultado
- Atualizar AIJob
- Registrar custo real
- Registrar créditos cobrados
- Estornar créditos em caso de falha quando aplicável
- Registrar auditoria

---

# 2. ARQUITETURA

Não permitir que componentes React ou páginas conheçam diretamente a API da fal.ai.

O fluxo deverá ser:

```text
Frontend
   ↓
API / Server Action
   ↓
AI Service
   ↓
AI Provider Layer
   ↓
fal.ai Adapter
   ↓
fal.ai API
```

Retorno:

```text
fal.ai
   ↓
Webhook
   ↓
API Webhook
   ↓
Validação
   ↓
AI Provider Layer
   ↓
AI Job Service
   ↓
Storage
   ↓
AIJob COMPLETED
```

A camada de provider deverá permitir futuramente:

```text
AI Provider
├── fal.ai
├── Provider futuro 1
├── Provider futuro 2
└── Provider futuro 3
```

Não criar dependência arquitetural irreversível da fal.ai.

---

# 3. MODELOS E ENDPOINTS DO MVP

Utilizar os endpoints oficiais atualmente disponíveis na fal.ai.

Não inventar endpoints, parâmetros ou modelos.

Antes de implementar cada adapter, validar a documentação oficial atual da fal.ai.

## 3.1 FLUX

Modelo inicial:

```text
FLUX.1 [dev]
```

Endpoint:

```text
fal-ai/flux/dev
```

Função:

```text
Texto → Imagem
```

Registrar no catálogo do sistema:

- Provider
- Endpoint
- Modelo
- Versão
- Unidade de cobrança
- Custo atual
- Status
- Configurações
- Créditos cobrados

---

# 4. KLING 3.0 MOTION CONTROL

Modelo:

```text
Kling 3.0 Motion Control Standard
```

Endpoint:

```text
fal-ai/kling-video/v3/standard/motion-control
```

Função:

```text
Imagem do personagem
+
Vídeo de referência
↓
Vídeo com o personagem executando os movimentos
```

Suportar os parâmetros documentados oficialmente pela fal.ai.

Registrar:

- Duração
- Orientação
- Modelo
- Custo por unidade
- Créditos cobrados
- Provider request ID

Começar com a versão Standard.

Deixar a arquitetura preparada para a versão Pro.

---

# 5. SEEDANCE 2.0

Utilizar inicialmente:

```text
ByteDance Seedance 2.0
```

Endpoints oficiais a serem avaliados conforme a ferramenta:

```text
bytedance/seedance-2.0/text-to-video
bytedance/seedance-2.0/image-to-video
bytedance/seedance-2.0/reference-to-video
```

Priorizar Reference-to-Video quando a ferramenta exigir múltiplas referências.

Não implementar Seedance 2.5 como dependência do MVP enquanto sua API oficial e preço não estiverem definitivamente disponíveis para uso.

Deixar estrutura preparada para futuro cadastro do Seedance 2.5.

---

# 6. LIP SYNC

Modelo inicial:

```text
Sync Lipsync 1.9
```

Endpoint:

```text
fal-ai/sync-lipsync
```

Função:

```text
Vídeo
+
Áudio
↓
Vídeo com sincronização labial
```

Registrar a unidade de cobrança conforme documentação oficial.

Deixar catálogo preparado para:

- Sync 2.0
- Sync 2.0 Pro
- Sync 3

Não substituir o modelo ativo sem alteração explícita no catálogo/configuração.

---

# 7. VIDEO UPSCALER

Utilizar inicialmente o endpoint oficial:

```text
fal-ai/video-upscaler
```

Registrar:

- Modelo
- Scale
- Unidade de cobrança
- Custo
- Créditos
- Resultado

A arquitetura deverá permitir adicionar outros upscalers futuramente.

---

# 8. CATÁLOGO DE MODELOS

O banco deverá ser a fonte de configuração dos modelos.

Não hardcodar preços ou custos de IA nas telas.

Cada modelo deverá possuir estrutura equivalente a:

```text
AIModel

id
providerId
name
slug
endpointId
version
billingUnit
providerUnitCostUsd
creditCost
active
configuration
createdAt
updatedAt
```

Avaliar se campos adicionais são necessários.

---

# 9. UNIDADE DE COBRANÇA

A unidade de cobrança deve ser armazenada explicitamente.

Exemplos:

```text
IMAGE
MEGAPIXEL
SECOND
MINUTE
REQUEST
```

Não assumir que todos os modelos possuem cobrança por geração.

O cálculo deverá respeitar a unidade real do provedor.

---

# 10. CUSTO REAL DO PROVEDOR

Separar obrigatoriamente:

**Custo da fal.ai**

de

**Créditos cobrados do usuário**

Exemplo:

```text
Kling Motion

Custo fal.ai:
US$ 0,126 / segundo

Duração:
10 segundos

Custo estimado:
US$ 1,26

Créditos cobrados:
120
```

Esses valores não devem ser confundidos.

---

# 11. SNAPSHOT FINANCEIRO DO AIJob

Cada geração deverá armazenar um snapshot dos valores utilizados naquele momento.

O AIJob deverá registrar, quando aplicável:

```text
provider
providerModel
providerEndpoint
providerRequestId

billingUnit
billingQuantity
providerUnitCostUsd
providerCostUsd

creditsReserved
creditsCharged
creditsRefunded

creditPriceVersion
status
```

O objetivo é garantir que o histórico financeiro não seja alterado caso o preço do provedor mude futuramente.

Exemplo:

Hoje:

```text
providerUnitCostUsd = 0.126
```

Amanhã:

```text
providerUnitCostUsd = 0.150
```

Uma geração realizada hoje deverá continuar registrada com:

```text
0.126
```

Não recalcular históricos usando o preço atual.

---

# 12. PREÇOS DA fal.ai

Sempre que possível, utilizar os mecanismos oficiais da fal.ai para consultar pricing e usage.

Não assumir que preços são permanentes.

Porém:

**Nunca alterar automaticamente o preço cobrado do usuário apenas porque o preço da fal.ai mudou.**

A atualização do custo interno e a atualização do preço em créditos são decisões diferentes.

O administrador deverá poder ajustar posteriormente os créditos cobrados.

---

# 13. MARGEM

A estrutura deverá permitir futuramente calcular:

```text
Receita estimada
-
Custo do provedor
=
Margem bruta
```

Não implementar ainda um dashboard financeiro completo.

Porém, todos os dados necessários deverão ser armazenados.

---

# 14. SISTEMA DE CRÉDITOS

Antes de iniciar uma geração:

```text
Usuário
 ↓
Autenticação
 ↓
Validação da ferramenta
 ↓
Validação do modelo
 ↓
Cálculo do custo
 ↓
Verificação de créditos
 ↓
Criação do AIJob
 ↓
Operação transacional de crédito
 ↓
Envio para fal.ai
```

A operação deverá utilizar o `CreditService` criado na Fase 3.

Não criar uma segunda lógica de créditos.

---

# 15. RESERVA E CONSUMO

Definir claramente a política de crédito.

Para operações cujo custo é conhecido antes da execução:

```text
Criar Job
↓
Reservar/consumir créditos
↓
Executar
```

Para operações cujo custo final depende do processamento:

avaliar tecnicamente a estratégia adequada.

Documentar a decisão.

Não permitir saldo negativo.

---

# 16. FALHA

Se o provedor falhar e a operação não gerar custo:

```text
AIJob FAILED
↓
Refund
```

O estorno deverá passar pelo `CreditService`.

Nunca alterar saldo diretamente.

Criar:

```text
CreditTransaction
type = REFUND
```

com referência ao AIJob original.

---

# 17. IDEMPOTÊNCIA

Toda geração deverá possuir proteção contra duplicidade.

Cenários:

- Duplo clique
- Múltiplas abas
- Retry
- Timeout
- Reenvio da requisição
- Refresh
- Perda de conexão
- Retry automático

Utilizar idempotency key.

A mesma operação não pode gerar dois AIJobs válidos.

---

# 18. IMPORTANTE SOBRE IDEMPOTENCY KEY

A chave deverá ser validada no backend.

Não confiar apenas na chave enviada pelo frontend.

O backend deverá verificar:

```text
Usuário
+
Idempotency Key
+
Ferramenta
+
Estado da operação
```

Criar constraint adequada no banco quando aplicável.

---

# 19. RATE LIMITING

Aplicar limites para:

- Geração de imagem
- Geração de vídeo
- Motion Control
- Lip Sync
- Upscale
- Upload
- Webhooks
- Endpoints administrativos

Combinar, quando apropriado:

```text
IP
Usuário
Ferramenta
Endpoint
```

Os limites devem ser configuráveis.

---

# 20. FAL_KEY

A chave da fal.ai deve existir somente no backend.

Nunca:

- Frontend
- Client Component
- Browser
- HTML
- JavaScript público
- Git
- Docs
- `.env.example`

Utilizar:

```text
FAL_KEY=
```

apenas como placeholder no `.env.example`.

A chave real deverá permanecer no ambiente local/produção.

---

# 21. WEBHOOKS

Implementar endpoint específico para callbacks da fal.ai.

Exemplo conceitual:

```text
/api/webhooks/fal
```

Não assumir que o webhook será recebido apenas uma vez.

Validar:

- Autenticidade
- Assinatura
- Payload
- Provider
- Request ID
- Job
- Estado atual
- Idempotência

---

# 22. WEBHOOK FORA DE ORDEM

O sistema deverá lidar com eventos fora de ordem.

Exemplo:

```text
COMPLETED
↓
PROCESSING
```

Não permitir que `PROCESSING` faça o Job voltar de `COMPLETED`.

Estados devem possuir transições válidas.

---

# 23. RESULTADOS

Quando a geração terminar:

```text
Webhook
 ↓
Validar
 ↓
Localizar AIJob
 ↓
Validar estado
 ↓
Obter resultado
 ↓
Transferir para Storage
 ↓
Criar AIJobOutput
 ↓
Atualizar AIJob
 ↓
COMMIT
```

Não depender permanentemente da URL temporária fornecida pelo provedor.

Sempre que necessário, copiar o resultado para o storage definitivo.

---

# 24. STORAGE

Em desenvolvimento:

Utilizar o provider local já definido na arquitetura.

Em produção:

Utilizar Cloudflare R2.

A lógica de IA não deve conhecer diretamente o provider de storage.

Utilizar a abstração existente.

---

# 25. AIJob

Revisar a estrutura existente de:

```text
AIJob
AIJobInput
AIJobOutput
```

Adicionar os campos necessários para:

- Provider
- Modelo
- Endpoint
- Request ID
- Idempotency key
- Estado
- Custo
- Créditos
- Tempo
- Erros
- Metadados
- Auditoria

Não duplicar dados sem necessidade.

---

# 26. ESTADOS DO JOB

Utilizar máquina de estados documentada.

No mínimo:

```text
PENDING
PROCESSING
COMPLETED
FAILED
CANCELLED
```

Avaliar necessidade de:

```text
QUEUED
```

ou outros estados.

Não permitir transições inválidas.

---

# 27. RETRIES

Retries devem ser controlados.

Nunca repetir automaticamente uma geração sem avaliar:

- Idempotência
- Estado
- Possível cobrança
- Request ID
- Tipo de erro

Não realizar retry infinito.

Diferenciar:

```text
Erro transitório
```

de:

```text
Erro permanente
```

---

# 28. TIMEOUT

Definir timeout para chamadas ao provedor.

Timeout não significa automaticamente que a geração falhou.

Antes de criar outro Job:

consultar o estado da operação quando possível.

Evitar geração duplicada.

---

# 29. LOGS

Registrar informações técnicas suficientes para diagnóstico:

- Job ID
- User ID
- Provider
- Model
- Endpoint
- Request ID
- Estado
- Tempo
- Erro
- Código HTTP
- Tentativa
- Timestamp

Nunca registrar:

- FAL_KEY
- Secrets
- Tokens
- Dados sensíveis desnecessários

---

# 30. UX MOBILE

Todas as interfaces de geração devem ser pensadas para celular.

O usuário deverá conseguir:

- Fazer upload
- Selecionar mídia
- Configurar geração
- Digitar prompt
- Escolher modelo
- Visualizar custo
- Confirmar geração
- Acompanhar processamento
- Visualizar resultado
- Baixar
- Compartilhar

Não criar interface apenas "responsiva".

Ela deve ser realmente utilizável por touch.

Tabelas complexas devem ser substituídas por cards/listas no mobile quando necessário.

---

# 31. FEEDBACK DE GERAÇÃO

Toda geração deverá possuir estados visuais claros:

```text
Preparando
Enviando
Na fila
Processando
Finalizando
Concluído
Falhou
```

Não deixar o usuário sem feedback.

Se o processamento demorar:

mostrar progresso/status adequado.

Não inventar porcentagem quando o provedor não fornece progresso real.

---

# 32. CANCELAMENTO

Não implementar um botão de cancelamento que simplesmente "cancela" o job no frontend.

Primeiro verificar se a fal.ai permite cancelamento seguro para aquele endpoint.

Se permitir:

implementar corretamente.

Se não permitir:

documentar a limitação e tratar o estado de forma adequada.

A política de créditos deverá ser respeitada.

---

# 33. CATÁLOGO ADMINISTRÁVEL

A arquitetura deverá permitir posteriormente que o ADMIN controle:

- Ativar/desativar modelo
- Alterar créditos cobrados
- Alterar prioridade
- Definir modelo padrão
- Definir limite
- Alterar configurações permitidas
- Criar promoções
- Ativar/desativar ferramentas

Não criar ainda o painel completo.

Mas o backend deve estar preparado.

---

# 34. PROMOÇÕES

Preparar estrutura para futuramente permitir:

```text
Preço normal
Preço promocional
Data inicial
Data final
Limite de uso
Ativo
```

Não implementar o sistema completo de promoções nesta fase.

---

# 35. HISTÓRICO FINANCEIRO

Nunca sobrescrever:

- Custo original
- Créditos originalmente cobrados
- Quantidade processada
- Modelo utilizado
- Provider utilizado

Esses dados fazem parte do histórico financeiro da geração.

---

# 36. USUÁRIO UNLIMITED

Respeitar a estrutura criada na Fase 3.

Usuários com:

```text
creditMode = UNLIMITED
```

não devem sofrer bloqueio por saldo.

Porém:

- AIJob continua sendo registrado
- Custo real continua sendo registrado
- Consumo continua sendo contabilizado internamente
- Auditoria continua funcionando
- Rate limiting continua funcionando

"Unlimited" significa sem cobrança de créditos, não sem limites técnicos ou de segurança.

---

# 37. SEGURANÇA

Aplicar as Diretrizes Globais:

- Zero Trust
- Backend como fonte de verdade
- Validação Zod
- Rate limiting
- Idempotência
- Auditoria
- Constraints
- Transações
- Controle de permissões
- Proteção de secrets

---

# 38. TESTES

Criar testes abrangentes.

### Provider

- Configuração válida
- Configuração inválida
- Provider indisponível
- Modelo desativado

### Créditos

- Saldo suficiente
- Saldo insuficiente
- Usuário unlimited
- Consumo
- Refund

### Idempotência

- Mesmo request duas vezes
- Requests simultâneos
- Retry
- Refresh

### Jobs

- PENDING
- PROCESSING
- COMPLETED
- FAILED
- CANCELLED
- Transições inválidas

### Webhooks

- Webhook válido
- Webhook duplicado
- Webhook inválido
- Webhook fora de ordem
- Job inexistente
- Request ID inexistente

### Financeiro

- Snapshot do custo
- Snapshot dos créditos
- Mudança futura de preço
- Refund
- Refund duplicado

### Segurança

- Usuário sem permissão
- Endpoint protegido
- Payload inválido
- Rate limit

---

# 39. TESTE DE INTEGRAÇÃO COM FAL.AI

Não executar chamadas reais à fal.ai em todos os testes automatizados.

Criar adapters mockados para:

- Desenvolvimento
- Testes unitários
- Testes de integração

Quando forem necessárias chamadas reais:

utilizar explicitamente um ambiente/configuração controlada.

Nunca permitir que a suíte de testes gere consumo financeiro ilimitado na conta real.

---

# 40. CUSTOS DE DESENVOLVIMENTO

Criar configuração para limitar chamadas reais durante desenvolvimento.

Exemplo conceitual:

```text
AI_PROVIDER_MODE=mock
```

ou equivalente arquitetural.

Quando estiver em:

```text
mock
```

nenhuma chamada real à fal.ai deve ser realizada.

Quando estiver em:

```text
live
```

as chamadas reais serão permitidas.

Documentar claramente essa configuração.

---

# 41. DOCUMENTAÇÃO OBRIGATÓRIA

Atualizar:

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

A documentação de IA deverá conter uma tabela semelhante a:

| Provider | Modelo | Endpoint | Função | Unidade | Custo Provider | Créditos VORIXA | Status |
|---|---|---|---|---|---:|---:|---|
| fal.ai | FLUX.1 dev | `fal-ai/flux/dev` | Texto → Imagem | MP | configurável | configurável | Active |
| fal.ai | Kling 3 Standard Motion | `fal-ai/kling-video/v3/standard/motion-control` | Motion Control | segundo | configurável | configurável | Active |
| fal.ai | Seedance 2.0 | `bytedance/seedance-2.0/*` | Vídeo | conforme modelo | configurável | configurável | Active |
| fal.ai | Sync Lipsync 1.9 | `fal-ai/sync-lipsync` | Lip Sync | minuto | configurável | configurável | Active |
| fal.ai | Video Upscaler | `fal-ai/video-upscaler` | Upscale | conforme modelo | configurável | configurável | Active |

Não inventar valores quando a documentação oficial não fornecer o dado.

Registrar a data da última verificação dos preços.

---

# 42. PREÇOS E USAGE DA fal.ai

Pesquisar e utilizar os mecanismos oficiais disponíveis da fal.ai para:

- Pricing
- Usage
- Model information

Não implementar scraping de páginas.

Quando houver API oficial para pricing/usage, priorizá-la.

Os valores obtidos deverão ser tratados como dados internos.

Não alterar automaticamente os créditos cobrados do usuário.

---

# 43. FUTURO PAINEL ADMIN

Não implementar o dashboard completo nesta fase.

Porém, garantir que os dados permitam futuramente exibir:

### Custos

- Custo total
- Custo por modelo
- Custo por ferramenta
- Custo por usuário
- Custo por período

### Receita

- Créditos vendidos
- Créditos consumidos
- Bônus
- Receita

### Margem

```text
Receita
-
Custo IA
=
Margem
```

### Operações

- Gerações
- Falhas
- Refunds
- Jobs ativos
- Jobs concluídos

---

# 44. GIT E CONTROLE DE VERSÃO

O projeto já possui repositório Git configurado:

```text
https://github.com/pitarf/vorixa.git
```

Todo desenvolvimento deverá respeitar controle de versão.

Ao finalizar a Fase 4:

1. Verificar `git status`
2. Revisar `git diff`
3. Confirmar que secrets não estão sendo versionados
4. Confirmar `.gitignore`
5. Confirmar documentação
6. Executar testes
7. Executar build
8. Criar commit específico da Fase 4

Utilizar mensagem de commit descritiva, por exemplo:

```text
feat: implementacao do motor de IA e integracao falai
```

Não misturar alterações não relacionadas.

---

# 45. CHECKLIST DE SEGURANÇA ANTES DA ENTREGA

Antes de considerar a Fase 4 concluída, verificar:

- FAL_KEY não aparece no Git
- FAL_KEY não aparece no frontend
- FAL_KEY não aparece no build público
- Idempotência funcionando
- Webhook protegido
- Webhook duplicado protegido
- Crédito duplicado protegido
- Refund duplicado protegido
- Jobs duplicados protegidos
- Rate limiting funcionando
- AIJob auditável
- Snapshot financeiro funcionando
- Preço histórico preservado
- Usuário unlimited funcionando
- Mock mode funcionando
- Falhas sem cobrança tratadas
- Storage funcionando
- Mobile funcionando
- Build passando
- Testes passando

---

# 46. NÃO IMPLEMENTAR AINDA

Não implementar nesta fase:

- VorexPay
- Checkout
- Marketplace completo de modelos reais
- Assinaturas
- Dashboard financeiro completo
- Sistema completo de promoções
- Landing Page definitiva
- Seedance 2.5 como dependência
- Outros providers além da fal.ai

Apenas deixar arquitetura preparada.

---

# 47. REGRA DE NÃO AVANÇO

Ao concluir a Fase 4:

**NÃO iniciar a Fase 5 automaticamente.**

Apresentar relatório completo contendo:

- Arquivos criados
- Arquivos modificados
- Dependências
- Adapters
- Endpoints utilizados
- Modelos implementados
- Estrutura de AIJob
- Estrutura de custos
- Estrutura de créditos
- Estratégia de idempotência
- Webhooks
- Storage
- Testes
- Testes reais realizados, se houver
- Testes mockados
- Resultado do build
- Segurança
- Git status
- Commit criado
- Documentação atualizada
- Problemas encontrados
- Limitações da API
- Decisões técnicas

Aguardar autorização explícita antes de iniciar a Fase 5.

---

# 48. REGRA ABSOLUTA

Se qualquer informação da documentação oficial da fal.ai divergir deste documento, **não assumir silenciosamente**.

Registrar a divergência em:

```text
/docs/DECISIONS.md
```

e apresentar a alteração no relatório da Fase 4.

Nunca inventar endpoint, modelo, parâmetro, preço ou comportamento da API.

A documentação oficial atual da fal.ai deve ser considerada a fonte de verdade para os contratos da API externa.