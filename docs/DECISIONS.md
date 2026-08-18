# ARCHITECTURAL DECISIONS RECORD (ADR) - VORIXA

Este documento registra as decisões arquiteturais tomadas durante a concepção e desenvolvimento do VORIXA.

---

DECISION-001
Data: 2026-08-17
Decisão: Escolha do Next.js como framework unificado (Monorepo/Aplicação Integrada).
Motivo: Reduzir a latência entre frontend/backend, simplificar o deploy para o MVP comercial, centralizar a base de código TypeScript e reduzir custos de infraestrutura de microsserviços.
Alternativas consideradas: Single Page Application (Vite + React) com Backend separado em Node.js (Express/NestJS).
Consequências: Todo o desenvolvimento do painel administrativo, rotas de API, conexões do banco de dados (Prisma) e Landing Page residem no mesmo repositório do Next.js. O deploy pode ser realizado com um clique na Vercel ou encapsulado em Docker.

---

DECISION-002
Data: 2026-08-17
Decisão: Uso de Transações SQL (`prisma.$transaction`) para movimentações de crédito.
Motivo: Evitar perda ou duplicação de dados, além de garantir consistência matemática do saldo dos usuários contra acessos concorrentes e falhas parciais.
Alternativas consideradas: Débito e crédito baseados em consultas SQL simples (sem bloco de transação).
Consequências: Toda movimentação de créditos (débito de job de IA, estorno por falha, compra aprovada por webhook, ajuste do admin) é envolvida em transações isoladas do banco PostgreSQL. Isso garante que a soma das transações coincida perfeitamente com o saldo armazenado na tabela `CreditBalance`.

---

DECISION-003
Data: 2026-08-17
Decisão: Criação de Webhooks Idempotentes por meio do registro de `PaymentWebhook`.
Motivo: Os gateways de pagamento (VorexPay) podem enviar webhooks duplicados por falhas de latência ou políticas de retentativa automática. Sem proteção, créditos poderiam ser duplicados para a conta do usuário.
Alternativas consideradas: Confiar na liberação baseada apenas em eventos únicos sem histórico persistido dos eventos.
Consequências: Cada payload recebido gera um registro na tabela `PaymentWebhook` usando o ID único do evento (`gatewayEventId`). Se o ID já existir, o backend responde HTTP 200 de imediato e ignora o processamento do corpo do webhook.

---

DECISION-004
Data: 2026-08-17
Decisão: Abstração de Integrações Externas (`IAIProvider` e `IPaymentProvider`).
Motivo: Garantir que a troca de chaves, provedores de IA (fal.ai, Replicate) ou gateways financeiros (VorexPay, Stripe, Asaas) não quebrem o fluxo principal de negócios e a interface visível para os usuários.
Alternativas consideradas: Acoplamento direto das APIs de provedores específicos nas rotas de API do Next.js.
Consequências: O código central consome interfaces abstratas e injeta os adaptadores específicos via variáveis de ambiente ou injeção de dependência simples. A inclusão de um novo gateway de pagamentos exige apenas a criação de uma nova classe que implementa `IPaymentProvider`.

---

DECISION-005
Data: 2026-08-17
Decisão: Arquitetura Stateless e Desacoplamento Conceitual de Workers.
Motivo: Preparar a aplicação para escalabilidade horizontal (auto-scaling) e evitar o travamento do servidor HTTP com o processamento assíncrono de mídia.
Alternativas consideradas: Guardar uploads temporários no filesystem do container e usar polling baseado em threads locais.
Consequências: As sessões utilizam exclusivamente JWT autocontidos e os uploads vão direto para o Cloudflare R2 via presigned URLs. A execução de jobs é modelada de forma que, se necessário, o processamento pode ser migrado para um worker separado via Redis/BullMQ sem alterar os controladores HTTP.

---

DECISION-006
Data: 2026-08-17
Decisão: Rastreamento de Origem de Marketing (UTMs) no Cadastro.
Motivo: Permitir a mensuração precisa de campanhas de tráfego pago para justificar o investimento comercial em aquisição de usuários.
Alternativas consideradas: Configuração de pixels externos apenas no frontend de forma isolada.
Consequências: Parâmetros UTM (`utm_source`, etc.) são capturados pelo frontend na entrada do site, armazenados em cookies e enviados ao backend no momento do cadastro do usuário, vinculando de forma nativa e definitiva a origem do tráfego às futuras compras e consumo de créditos.

---

DECISION-007
Data: 2026-08-17
Decisão: Adoção do Design System Centralizado Baseado na Logo Oficial.
Motivo: Evitar a fragmentação visual e garantir consistência na identidade de marca (Violeta, Azul Elétrico, Ciano, Preto e Branco) sem espalhar cores e regras arbitrárias hardcoded.
Alternativas consideradas: Configuração ad-hoc de classes de cores do Tailwind espalhadas diretamente nas páginas e componentes.
Consequências: Toda a estilização consome variáveis do arquivo de tokens. Componentes e classes utilitárias utilizam exclusivamente as funções semânticas (`primary`, `secondary`, `accent`, `background`, etc.). Qualquer alteração de branding futura exige modificações exclusivamente na declaração dos tokens globais.

---

DECISION-008
Data: 2026-08-18
Decisão: Uso de Bloqueio Pessimista (`FOR UPDATE`) no Postgres para Concorrência de Créditos.
Motivo: Prevenir condições de corrida quando requisições simultâneas tentam consumir saldo simultaneamente, burlando validações simples de saldo.
Alternativas consideradas: Bloqueio otimista via controle de versão de linhas ou validação puramente baseada em código JavaScript/Node.js.
Consequências: Toda transação de consumo, reembolso ou ajuste manual executa uma consulta raw `SELECT FOR UPDATE` para garantir isolamento físico na linha do saldo antes da leitura e escrita. O isolamento previne abusos de concorrência com 100% de precisão no banco.

---

DECISION-009
Data: 2026-08-18
Decisão: Adoção da convenção `proxy.ts` (Next.js 16) em substituição ao `middleware.ts`.
Motivo: Adaptação à depreciação da convenção clássica de middleware promovida pela equipe do Next.js na versão 16.
Alternativas consideradas: Manter o `middleware.ts` exibindo warnings contínuos de compilação.
Consequências: O controle de acesso de rotas do NextAuth e regras de RBAC foram implementados no arquivo `proxy.ts` na raiz do projeto, limpando avisos de build e mantendo total compatibilidade nativa com o App Router do Next.js 16.

---

DECISION-010
Data: 2026-08-18
Decisão: Consolidação das Diretrizes Globais de UX Mobile First e Segurança Financeira Zero Trust.
Motivo: Padronizar o desenvolvimento de frontend e backend em torno de usabilidade móvel real por toque (Tabelas -> Cards, etc.) e garantir integridade financeira impedindo duplicidade por múltiplos cliques ou tentativas de fraude.
Alternativas consideradas: Confiar em validações isoladas e designs ad-hoc específicos para cada tela.
Consequências: Todas as novas interfaces serão testadas em múltiplos breakpoints de tela pequena a desktop. O backend recalcula e valida todas as operações críticas e faturamentos de créditos de forma isolada, ignorando parâmetros editáveis enviados pelo cliente frontend.




