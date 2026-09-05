# MANUAL DO DESENVOLVEDOR - VORIXA

Este manual orienta novos desenvolvedores na configuração do ambiente local de desenvolvimento da plataforma VORIXA.

## 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina local:
* **Node.js** (versão 18.x ou superior).
* **PostgreSQL** instalado e executando nativamente no sistema operacional.
* **Git**.

---

## 2. Configuração do Ambiente Local

### Passo 1: Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/usuario/vorixa.git
cd vorixa
npm install
```

### Passo 2: Configurar Variáveis de Ambiente
Crie um arquivo `.env` a partir do `.env.example`:
```bash
cp .env.example .env
```
Preencha a variável `DATABASE_URL` com as suas credenciais locais do PostgreSQL (exemplo):
```env
DATABASE_URL="postgresql://postgres:sua_senha_local@localhost:5432/vorixa_db?schema=public&connection_limit=10"
AUTH_SECRET="uma-chave-aleatoria-e-longa-para-jws"
FAL_KEY="sua-chave-api-da-fal-ai"
VOREXPAY_API_KEY="sua-chave-api-do-vorexpay"
VOREXPAY_WEBHOOK_SECRET="seu-secret-de-webhook-do-vorexpay"

# Em desenvolvimento local sem Docker/MinIO, o storage de arquivos é emulado automaticamente na pasta /public/uploads
```

### Passo 3: Executar as Migrations e Alimentar o Banco
```bash
# Executa as migrations do Prisma e sincroniza as tabelas no PostgreSQL local
npx prisma migrate dev

# Roda o script de Seed para povoar as tabelas de modelos e ferramentas
npx prisma db seed
```

### Passo 4: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em [http://localhost:3000](http://localhost:3000).

---

## 3. Rodando Testes e Validando Código

Antes de realizar commits ou abrir pull requests, verifique se o seu código atende aos padrões e passa nos testes:

```bash
# Roda as suítes de testes unitários e de integração
npm run test

# Executa o linter para verificar padrões de formatação
npm run lint
```

> **Atenção (Diretriz de Testes & Segurança - `.agents/rules/03-testing.md`)**:
> Comportamentos financeiros e controles críticos de segurança — incluindo **conciliabilidade do Ledger, idempotência, atomicidade, concorrência (`SELECT FOR UPDATE`), RBAC, prevenção a IDOR, Mass Assignment e Race Conditions** — devem ser validados obrigatoriamente contra uma instância real do **PostgreSQL via Prisma** (ambiente local/test DB), vedado o uso de mocks superficiais em memória para atestar conformidade de banco. Todo teste adversarial deve adotar o princípio de Mutation QA (modelagem de falsos positivos).

---

## 4. Configurando Credenciais do Google Cloud (Google OAuth)

Para habilitar a funcionalidade de login com o Google no ambiente local de desenvolvimento, siga as instruções:

1. Acesse o **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Crie um novo projeto ou selecione um existente.
3. No menu lateral, navegue até **APIs e Serviços** > **Tela de permissão OAuth** (OAuth Consent Screen). Configure o escopo básico (`email`, `profile`).
4. Navegue até **Credenciais** > **Criar credenciais** > **ID do cliente OAuth**.
5. Selecione o tipo de aplicativo: **Aplicativo da Web**.
6. Cadastre as seguintes URLs:
   * **Origens JavaScript autorizadas**: `http://localhost:3000`
   * **URIs de redirecionamento autorizados**: `http://localhost:3000/api/auth/callback/google`
7. Clique em criar e obtenha o **ID do cliente** e o **Secret do cliente**.
8. Insira estes valores no seu arquivo `.env` local:
   ```env
   GOOGLE_CLIENT_ID="seu-client-id-aqui"
   GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"
   ```
9. Para ambientes de produção, crie uma credencial OAuth adicional no Google Cloud cadastrando o domínio final de produção (ex: `https://dominio-do-vorex.com/api/auth/callback/google`).

---

## 5. Módulo de Pagamentos e Ledger Financeiro (Fase 6 & 6.5)

### Arquitetura Financeira
* **Modelagem**: Transações de crédito são atômicas (`CreditBalance` e `CreditTransaction`).
* **Integridade do Ledger**: Toda concessão ou débito é processado com `prisma.$transaction` e `SELECT FOR UPDATE` para evitar double-spending e race conditions.
* **Gateway VorexPay**:
  * Provedor desacoplado via interface `PaymentProvider` com chave `PAYMENT_PROVIDER_MODE=mock` ou `live`.
  * Validação criptográfica de Webhooks (`x-signature` HMAC SHA-256) e idempotência estrita via `PaymentRecord.gatewayTxId` e `CreditTransaction.paymentId`.

---

## 6. Painel Administrativo & Segurança Anti-IDOR (Fase 7 & 7.1)

### Governança Administrativa
* **Proteção de Rotas**: `proxy.ts` valida `token.role === "ADMIN"` para qualquer rota sob `/api/admin/*` ou `/dashboard/admin/*`.
* **Idempotência Administrativa**: Constraint única `[idempotencyKey]` em `CreditTransaction` impede double-granting mesmo em rajadas simultâneas.
* **Sanitização de SEO**: Atributos dinâmicos (`siteTitle`, `siteDescription`, `siteKeywords`, `faviconUrl`) são sanitizados contra XSS antes da injeção nas tags HTML e Open Graph.

---

## 7. Modelagem de Dados do VORIXA FLOW (Fase 8 - Etapa 3)

### Esquema Prisma
* **`Flow`**: Agregação raiz do grafo criativo (`userId`, `name`, `description`, `viewport`, `status`).
* **`FlowNode`**: Vértices do grafo (`flowId`, `nodeType`, `toolSlug`, `title`, `positionX`, `positionY`, `config`).
* **`FlowConnection`**: Arestas direcionadas tipadas com handles de entrada e saída. Constraint única `[flowId, sourceNodeId, sourceHandle, targetNodeId, targetHandle]`.
* **`FlowExecution`**: Registro macro de execução com rastreabilidade contábil (`creditsReserved`, `creditsCharged`, `creditsRefunded`, `idempotencyKey`).
* **`FlowNodeExecution`**: Execução individual de nós com snapshots de entrada (`resolvedInputs`) e saída (`outputs`).

---

## 8. Arquitetura do VORIXA FLOW Canvas & Frontend Core (Fase 8 - Etapa 5)

### 1. Stack Tecnológico de Frontend
* **`@xyflow/react`**: Engine espacial para renderização de grafos infinitos, dot matrix, minimap, drag & drop de nós e conexões inteligentes.
* **`Zustand` (`stores/flow-store.ts`)**: Store reativa modular responsável por gerenciar nodes, edges, histórico de undo/redo (`takeSnapshot`, `undo`, `redo`), persistência assíncrona, polling de execução e modais contextuais.

### 2. Custom Nodes & Identidade Visual Dark Obsidian
* **`BaseNode.tsx`**: Shell visual com handles de entrada e saída tipados por cor, menu contextual de ações rápidas, badges de status reativas (`RUNNING`, `QUEUED`, `COMPLETED`, `FAILED`, `SKIPPED`) e renderização de erro.
* **Nós Especializados**: `PromptNode`, `ImageNode`, `VideoNode`, `LipSyncNode`, `UpscaleNode`.

### 3. Custom Edges & Feedback de Execução
* **`CustomEdge.tsx`**: Curvas Bezier com stroke dinâmico e animação de partículas com dash glow durante o estado `isExecuting = true`.

---

## 9. Revisão Visual, UX, Performance e Segurança (Fase 5.1)

### 1. Sanitização Centralizada de Mídia (`lib/flow-utils.ts`)
* A função `isSafeMediaUrl(url)` valida compulsoriamente todas as origens antes de injetar URLs em tags `<img>`, `<video>` ou links `<a>` de download, neutralizando vetores de XSS baseados em `javascript:`, `vbscript:` ou `data:text/html`.

### 2. Acessibilidade e Performance
* **Acessibilidade**: Suporte a `@media (prefers-reduced-motion: reduce)`, teclado funcional com atalho `Escape` para fechar modais/inspetor e `aria-label` em todos os botões e handles.
* **Performance**: Nós e arestas memoizados com `React.memo`, debounce de snapshots no histórico e descarte de renders desnecessários com mais de 30 nós no Canvas.
* **Mobile-First**: Inspetor lateral se transforma em drawer responsivo em dispositivos móveis (`min-h-[44px]` para touch targets).

### 3. Invariante Contábil no Cancelamento de Fluxo
* No cancelamento (`FlowExecutionService.cancelExecution`), nós em execução e na fila são marcados como `CANCELLED` e seus créditos são estornados de forma atômica para o `CreditBalance` do usuário sob `SELECT FOR UPDATE`.
* A equação contábil permanece estritamente equilibrada: $\text{creditsReserved} = \text{creditsCharged} + \text{creditsRefunded}$.

---

## 10. Arquitetura do PromptEngine & Análise de Custos de IA (Fase 12)

### 1. Provedor Configurado e Fallback
* **`fal.ai/any-llm`**: Endpoint neural ativo consumindo a chave `FAL_KEY` existente no `.env`.
* **Motor Contextual Local (Fallback)**: Caso a chamada ao endpoint externo falhe ou esteja em modo mock/sem internet, o `PromptEngine.optimize()` assume instantaneamente com latência zero (0ms), garantindo que o usuário nunca seja bloqueado.

### 2. Tabela de Custos e Precificação (Anotação para Precificação de Planos)
* **fal.ai (`fal-ai/any-llm`)**: ~\$0.001 por chamada (~R\$ 0,005 / prompt) devido ao faturamento por GPU-segundo. Custo de ~R\$ 5,00 a cada 1.000 otimizações.
* **Migração Futura Recomendada (Google Gemini Flash / Groq)**: ~\$0.000018 por chamada (~R\$ 0,0001 / prompt). Custo de ~R\$ 0,10 a cada 1.000 otimizações (economia de 50x).
* **Impacto na Margem de Lucro**: Como o custo de LLM é inferior a 1 centavo mesmo na fal.ai, a funcionalidade "✦ Otimizar Prompt por IA" pode ser oferecida como bônus gratuito para o usuário nos pacotes de crédito do VORIXA.

### 3. Matriz de Custos de Imagem & Estratégia de Precificação Futura (Backlog Financeiro)
Quando chegarmos na etapa de refinamento de planos e pacotes de crédito, aplicar o seguinte modelo de dois tiers para geração de imagens:
* **Modo Rápido / Standard (FLUX Schnell / Dev)**:
  - Custo Real API: \$0.003 a \$0.025 (~R\$ 0,016 a R\$ 0,14 / imagem).
  - Cobrança Sugerida: **1 Crédito** (~R\$ 0,09 a R\$ 0,15 por geração).
  - Posicionamento: Geração rápida de rascunhos, testes e volume massivo.
* **Modo Cinema / Ultra (Recraft V3 Cinema Engine / Imagen 3)**:
  - Custo Real API: \$0.040 (~R\$ 0,22 / imagem).
  - Cobrança Sugerida: **3 a 4 Créditos** (~R\$ 0,35 a R\$ 0,45 por geração).
  - Posicionamento: Qualidade editorial máxima, cenários ricos, textos nítidos e fotorrealismo humano extremo (estilo Gemini).
  - Margem Bruta Estimada: **+55% a 70% de lucro** sobre os custos de infraestrutura da GPU.

