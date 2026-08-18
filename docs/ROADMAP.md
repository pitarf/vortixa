# ROADMAP DE DESENVOLVIMENTO - VORIXA

Este documento estabelece o cronograma de implementação do projeto VORIXA, dividido em fases incrementais com entregáveis claros.

## Fase 0: Documentação e Arquitetura (Fase Atual)
* **Objetivo**: Mapeamento completo de requisitos, modelagem do banco de dados, design de arquitetura técnica e registro de decisões técnicas.
* **Entregável**: Pasta `/docs` totalmente preenchida com as 25 especificações obrigatórias.

## Fase 1: Fundação do Projeto
* **Objetivo**: Inicialização do repositório, configuração do monorepo Next.js e docker local.
* **Entregáveis**:
  * Projeto Next.js (TypeScript) inicializado.
  * Docker Compose rodando PostgreSQL e MinIO local.
  * Prisma ORM instalado e conectado ao banco local.

## Fase 2: Autenticação
* **Objetivo**: Cadastro de usuários, login e logout com tratamento de sessões seguras.
* **Entregáveis**:
  * Telas de login, registro e recuperação de acesso.
  * Middleware de autenticação protegendo rotas internas.
  * Sistema de papéis (RBAC - User e Admin).

## Fase 3: Banco e Créditos
* **Objetivo**: Persistência do banco de dados e controle transacional de saldo.
* **Entregáveis**:
  * Migrations do banco criadas e executadas.
  * Serviço de alteração de créditos usando `prisma.$transaction`.
  * Criação das tabelas `CreditBalance` e `CreditTransaction`.

## Fase 4: Integração fal.ai
* **Objetivo**: Acoplamento do backend com os serviços externos de inteligência artificial.
* **Entregáveis**:
  * SDK/Cliente da fal.ai configurado via chaves de API secretas.
  * Endpoint `/api/webhooks/fal` pronto para escutar o processamento.
  * Validador de assinatura criptográfica para webhooks de IA.

## Fase 5: Ferramentas de IA
* **Objetivo**: Construção das 5 ferramentas principais do MVP.
* **Entregáveis**:
  * Painéis visuais para Gerador Imagem, Imagem para Vídeo, Motion Control, Lip Sync e Upscale.
  * Processamento assíncrono disparando jobs e exibindo status de loading na tela.
  * Lógica de estorno e crédito configurada em banco de dados.

## Fase 6: Pagamentos
* **Objetivo**: Monetização da plataforma via checkout integrado.
* **Entregáveis**:
  * Implementação da camada de `PaymentProvider` com o gateway VorexPay.
  * Webhook `/api/webhooks/vorexpay` com proteção contra ataques de repetição e pagamentos duplicados.
  * Liberação automática de pacotes de crédito no banco.

## Fase 7: Painel Administrativo
* **Objetivo**: Gestão operacional do negócio pelo administrador.
* **Entregáveis**:
  * Área administrativa com controle de usuários, saldo de créditos e alteração dos custos por modelo de IA.
  * Página de Branding para alteração dinâmica de SEO (siteTitle, siteDescription, faviconUrl).
  * Logs de Auditoria para ações críticas dos administradores.

## Fase 8: Landing Page
* **Objetivo**: Disponibilização pública da página de vendas para conversão.
* **Entregáveis**:
  * Landing page responsiva com seções Hero, Benefícios, Tabela de Preços e FAQ.
  * Canonical tags e metadados dinâmicos para indexação de busca.

## Fase 9: Testes
* **Objetivo**: Homologação técnica e de segurança da aplicação.
* **Entregáveis**:
  * Suíte de testes unitários rodando Vitest (validação de créditos e segurança de webhooks).
  * Testes de interface E2E cobrindo caminhos críticos de conversão.

## Fase 10: Deploy
* **Objetivo**: Lançamento da plataforma em ambiente de produção.
* **Entregáveis**:
  * Configuração de scripts de backup do PostgreSQL e do bucket S3.
  * Publicação na Vercel/VPS Docker.
  * Vinculação de domínios finais com certificados SSL.

---

## Futuro (Backlog de Expansão)
* Adição de novos modelos de geração de vídeo.
* Integração de workflows de edição em lote.
* Implementação do Seedance 2.5 (quando disponível a API estável).
* Planos de Assinaturas Mensais Recorrentes.
* Integração de múltiplos gateways (Mercado Pago, Stripe e Asaas).
* Sincronização automática em background dos custos reais de API da fal.ai (Pricing & Usage APIs) para painel administrativo.

---

## Evolução de Infraestrutura em Escala

O crescimento operacional e de tráfego do VORIXA seguirá três estágios estruturais bem delimitados:

### Estágio Inicial (MVP Controlado)
* **Arquitetura**: Next.js Monolito rodando em Container Docker único ou Vercel Serverless.
* **Workers**: Worker integrado na própria aplicação escutando webhooks ou polling básico.
* **Banco**: Instância única de PostgreSQL.
* **Storage**: Cloudflare R2 com CDN padrão (Zero Egress).

### Estágio de Crescimento (Tração Comercial)
* **Arquitetura**: Múltiplas réplicas stateless do Next.js HTTP Server.
* **Workers**: Separação física dos containers de aplicação Next.js e processamento de jobs.
* **Cache & Rate Limit**: Redis centralizado compartilhado para controlar limites de IP/usuários e dados temporários.
* **Banco**: Introdução de réplicas de leitura para relatórios e connection pooler (PgBouncer).
* **Storage**: CDNs dedicadas com regras de expiração inteligentes.

### Estágio de Grande Escala (Competição de Mercado)
* **Arquitetura**: Kubernetes / ECS para auto-scaling de réplicas HTTP e de Workers.
* **Workers**: Uso de filas dedicadas robustas (Redis + BullMQ) para processar dezenas de jobs simultâneos com priorização.
* **Banco**: Particionamento de tabelas de histórico (`CreditTransaction`, `AIJob`) e sharding de banco.

