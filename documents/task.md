# Roadmap de Tarefas - VORIXA

## Pendentes
- [ ] Nenhuma no momento. Toda a plataforma e infraestrutura foram finalizadas com 100% de cobertura.

## Fazendo
- [ ] Fase 13: Integração da Ferramenta de Provador Virtual (FASHN Virtual Try-On V1.6 `fal-ai/fashn/tryon/v1.6`).
- [ ] Fase 13.1: Expansão do Catálogo de Motores Google Nano Banana 2 e Gemini 3 Pro Preview.

## Concluído
- [x] Fase 0: Setup de Documentação Técnica e Regras de Desenvolvimento.
- [x] Fase 1: Setup do Projeto Next.js 16 + Tailwind CSS + Prisma + PostgreSQL + Docker.
- [x] Fase 2: Autenticação Completa (Credentials + Google OAuth + NextAuth v5 + RBAC).
- [x] Fase 3: Sistema de Créditos e Ledger Transacional com Isolamento Anti-Race-Condition.
- [x] Fase 4: Integração de Motores de IA (FLUX.1, Kling AI, LivePortrait LipSync, Upscale 4K).
- [x] Fase 5: VORIXA FLOW Studio & Visual Canvas (DAG Engine, Kahn Algorithm, Node Inspector).
- [x] Fase 5.1: Auditoria Adversarial e Homologação de Segurança do VORIXA FLOW (107 testes).
- [x] Fase 6: Sistema de Pagamentos e Webhooks (Mercado Pago + Stripe + Idempotência).
- [x] Fase 7: Painel Administrativo de Controle de Créditos e Reconciliação Transacional.
- [x] Fase 8: Módulos de Frontend (Studio CREATE, Library e Landing Page Cinematográfica).
- [x] Fase 8.1: Experiência Audiovisual e Asset Manifest (Mapeamento de mídias).
- [x] Fase 8.1.1: Produção Real de Imagens de IA (Eliminação de placeholders).
- [x] Fase 8.1.2: Produção Real de Vídeos MP4 e Densidade Audiovisual.
- [x] Fase 8.1.3: Reconstrução Visual Profunda da Landing Page (Referência Octuz AI & Padrão Cinematográfico Internacional: tipografia editorial Instrument Serif, alternância de superfícies off-white/dark, vídeos protagonistas reais, mosaico assimétrico, Before/After e build de produção 100% verde).
- [x] Fase 8.2: Módulo Completo de Carteira & Compra de Créditos (`/dashboard/credits` com histórico e checkout dinâmico).
- [x] Fase 8.3: Motor de SEO Dinâmico e Indexação (`app/robots.ts`, `app/sitemap.ts`, e injeção de metadados dinâmicos via `SystemSetting` em `app/layout.tsx`).
- [x] Fase 9: Testes Adversariais e Integração de Checkout (`__tests__/payments-checkout.test.ts` com 118/118 testes verdes no Vitest).
- [x] Fase 10: Infraestrutura de Deploy e Disaster Recovery (Dockerfile Multi-stage Standalone, `docker-compose.yml` completo, CI/CD GitHub Actions `.github/workflows/ci.yml`, scripts `backup-db.sh` e `restore-db.sh`).
- [x] Fase 11: Nova Landing Page Home2 de Alta Conversão (`/home2` com Benchmarking em `docs/BENCHMARK_HOME2_RESEARCH.md`, Copywriting Master em `docs/COPY_HOME2_MASTER.md`, preservando a Home `/` original intacta e com 118/118 testes Vitest verdes).
- [x] Fase 12: Motor de Otimização e Tradução de Prompts (PromptEngine com tradução de visual para inglês e preservação estrita de falas/scripts em Português, endpoint `/api/tools/optimize-prompt`, botão interativo no `PromptInput` e 121/121 testes verdes).
- [x] **Central de Novidades & Changelog Dinâmico (Fase 8.3)**:
  - Widget "Novidades no VORIXA" com fidelidade visual à referência, badges de modelos e link "Testar novos modelos no Flow →".
  - Modal interativo (`ChangelogModal.tsx`) com busca instantânea e filtros por categorias (Modelos de IA, Estúdio & Flow, Ferramentas, Plataforma).
  - Mapeamento completo dos 13 recursos reais disponíveis no ecossistema VORIXA com atalhos de teste com 1 clique.
  - Página dedicada `/dashboard/changelog` com histórico detalhado e timeline de roadmap.
  - 100% dos 122 testes Vitest verdes e build Next.js 16 validado com sucesso.
- [x] **Refatoração do Dashboard VORIXA CREATIVE OS (Fase 8.2)**:
  - Implementação cirúrgica da interface com base na referência visual: Topbar com busca omnibox `[ ⌘ K ]`, badge de créditos dourado `#F59E0B`, sino com popover, avatar com dropdown e sidebar Dark Obsidian.
  - Hero banner cinematográfico com saudação dinâmica, métricas operacionais (127 projetos, 842 ativos, uptime 99.99%) e botões táteis de ação rápida.
  - Grid dos 4 cards centrais de criação (Studio CREATE, VORIXA FLOW com pipeline animado, Build with AI e Biblioteca 2x2).
  - Seção de projetos recentes widescreen com Lightbox em tela cheia e 3 widgets inferiores (gráfico SVG de consumo 62%, destaque da comunidade e feed de novidades).
  - 100% dos 122 testes Vitest verdes e build Next.js 16 validado com sucesso.
- [x] **Conexão Direta SMTP Hostinger (E-mail Transacional)**:
  - Configurado `nodemailer` e `SMTPEmailProvider` nativo.
  - Conexão direta via SSL (Porta 465) com `smtp.hostinger.com` autenticada com sucesso (`contato@vortixia.com.br`).
  - Removida dependência da API Brevo.
- [x] **Integração Google Imagen 3 (fal-ai/nano-banana-pro)**:
  - Adicionado suporte dinâmico no backend e seletor visual na interface de imagem.
  - Calibração de enquadramento de corpo inteiro (cabeça aos pés sem cortes) e ambientação moderna/povoada no `PromptEngine`.
  - 100% dos 122 testes Vitest verdes e build Next.js 16 validado com sucesso.
