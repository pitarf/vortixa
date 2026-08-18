# BACKEND ARCHITECTURE - VORIXA

Este documento descreve a organização interna das camadas lógicas do Backend (Next.js API Routes).

## 1. Camadas de Organização do Código

Para garantir manutenibilidade e modularidade, o backend é estruturado em três camadas distintas:

```text
HTTP Request ──> Controller (Validation & HTTP Mapping) 
                     └──> Service (Core Business Logic)
                              └──> Providers / Adapters (External APIs / Database)
```

1. **Controller (API Routes - `/app/api/*`)**:
   * Responsável por capturar a requisição HTTP.
   * Executa a validação de parâmetros de entrada usando **Zod schemas**.
   * Retorna códigos de status HTTP apropriados e trata exceções capturadas.
2. **Services (`/services/*`)**:
   * Contém a lógica de negócios pura do sistema (cálculo de descontos, validação de transações).
   * Não possui dependência direta de detalhes HTTP (req/res).
   * Coordena as alterações no banco de dados e disparo de webhooks.
3. **Providers / Adapters (`/services/providers/*`)**:
   * Abstração de integrações de terceiros.
   * `FalAiProvider`: Contém os métodos para interagir com a API fal.ai.
   * `PaymentProvider`: Abstrai os gateways de pagamento.
   * `S3StorageProvider`: Gerencia uploads e remoção de arquivos.

---

## 2. Tratamento Global de Erros e Logs

Todo endpoint deve encapsular a lógica principal em um bloco `try/catch`. O sistema deve mapear exceções de negócios conhecidas para retornar mensagens de erro não-genéricas:

```typescript
export async function handleError(error: unknown) {
  console.error("Backend Error Logged:", error);
  
  if (error instanceof ValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }
  
  if (error instanceof InsufficientCreditsError) {
    return Response.json({ error: "Saldo de créditos insuficiente. Por favor, recarregue para continuar." }, { status: 402 });
  }

  return Response.json({ error: "Servidor instável. Tente novamente em alguns instantes." }, { status: 500 });
}
```

---

## 3. Isolamento e Proteção de Sessão

Todas as rotas sob `/api/jobs/*`, `/api/credits/*` e `/api/admin/*` devem passar por um middleware de autenticação que extrai o ID do usuário da sessão segura e anexa ao contexto. A rota administrativa `/api/admin/*` rejeita requisições se `user.role !== 'ADMIN'`.

---

## 4. Rate Limiting e Escala de Conexões de Banco

### 4.1 Rate Limiting de Proteção
Para proteger os recursos computacionais e financeiros da plataforma:
* **Fase Inicial**: Implementado um Middleware Next.js que controla limites em memória por IP de origem (usando algoritmos como token bucket simples).
* **Fase de Crescimento (Redis)**: Migração imediata da lógica do rate limiter para o Redis (ex: utilizando `@upstash/ratelimit` ou similar), compartilhando contadores entre todas as instâncias Next.js em execução horizontal.
* **Limites Definidos**:
  * Uploads de arquivos: máx 5 requisições por minuto por usuário.
  * Chamadas de API gerais: máx 60 requisições por minuto por IP.
  * Criação de jobs de IA: máx 10 por minuto por IP para evitar ataques de estouro de custos.

### 4.2 Pool de Conexões do Prisma (PostgreSQL)
Sob escalabilidade horizontal com Serverless (Vercel) ou múltiplos containers da aplicação Next.js, o banco PostgreSQL pode sofrer exaustão de conexões.
* **Preparação**: O Prisma Client é instanciado de forma Singleton (`globalThis.prisma`) para evitar vazamentos em ambiente de desenvolvimento.
* **Produção**: A aplicação está configurada para conectar via connection string otimizada com limitadores de pool (`?connection_limit=10`). Em escala maior, será adotado o uso de um pooler de conexões externo como **PgBouncer** ou serviço gerenciado correspondente.

