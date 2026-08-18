# INSTRUÇÃO PRINCIPAL DO PROJETO

Você será o responsável técnico pelo desenvolvimento de uma plataforma SaaS de criação de conteúdo utilizando inteligência artificial.

IMPORTANTE:

ANTES DE ESCREVER QUALQUER CÓDIGO DE PRODUÇÃO, IMPLEMENTAR QUALQUER FUNCIONALIDADE OU CRIAR QUALQUER TELA DEFINITIVA, VOCÊ DEVE PRIMEIRO ANALISAR TODO ESTE ESCOPO E GERAR A DOCUMENTAÇÃO TÉCNICA COMPLETA DO PROJETO.

Neste momento, NÃO desenvolva a aplicação.

Sua primeira tarefa é exclusivamente criar a documentação que servirá como fonte de verdade para todo o desenvolvimento futuro.

A documentação deverá ser suficientemente detalhada para que outro desenvolvedor consiga continuar o projeto sem precisar reinterpretar decisões já tomadas.

---

# 1. VISÃO GERAL DO PRODUTO

A aplicação será uma plataforma SaaS de criação de conteúdo com IA.

O usuário poderá utilizar diferentes ferramentas de inteligência artificial através de uma única interface.

O objetivo é oferecer uma experiência semelhante à proposta de plataformas como Octuz/Higgsfield, porém começando com um MVP controlado e com arquitetura preparada para expansão.

A plataforma deverá permitir posteriormente a adição de novos modelos de IA sem necessidade de reconstruir toda a aplicação.

A aplicação será comercial.

Os usuários poderão possuir créditos internos para utilizar as ferramentas de IA.

Também haverá possibilidade de planos, compra de créditos e futuramente assinaturas.

---

# 2. FUNCIONALIDADES PRINCIPAIS DO MVP

Documente detalhadamente cada uma das funcionalidades abaixo.

## 2.1 Autenticação

O sistema deverá possuir:

- Cadastro
- Login
- Logout
- Recuperação de acesso
- Sessão segura
- Controle de usuário autenticado
- Proteção de rotas
- Perfil básico do usuário

---

# 3. DASHBOARD

Criar uma área principal autenticada onde o usuário possa:

- Visualizar saldo de créditos
- Visualizar ferramentas disponíveis
- Iniciar uma nova geração
- Visualizar gerações recentes
- Acessar histórico
- Visualizar arquivos gerados
- Fazer download dos resultados
- Acessar seu perfil
- Acessar informações de plano/créditos

---

# 4. FERRAMENTAS DE IA

A arquitetura deve ser criada de forma modular.

NÃO criar integrações diretamente espalhadas pelas telas.

Criar uma camada de abstração de provedores/modelos.

Cada ferramenta deve possuir uma definição própria contendo:

- Identificador
- Nome
- Descrição
- Provedor
- Modelo
- Tipo
- Parâmetros
- Custo interno em créditos
- Status
- Limites
- Permissões
- Configurações

## 4.1 Gerador de imagens

Utilizar inicialmente modelos disponíveis pela fal.ai, como FLUX.

Fluxo:

Prompt
→ Backend
→ fal.ai
→ processamento
→ webhook/status
→ armazenamento
→ resultado
→ histórico
→ crédito descontado

---

## 4.2 Imagem para vídeo

Utilizar inicialmente modelos de vídeo disponíveis na fal.ai, como Kling.

Entrada:

- Imagem
- Prompt
- Configurações do vídeo

Saída:

- Vídeo gerado

---

## 4.3 Motion Control

Essa é uma das principais funcionalidades da plataforma.

O usuário deverá conseguir:

- Enviar uma imagem/personagem
- Enviar um vídeo de referência
- Iniciar a geração
- Acompanhar o processamento
- Visualizar o vídeo final
- Baixar o resultado

A implementação deverá utilizar inicialmente modelos Kling Motion Control disponíveis através da fal.ai.

IMPORTANTE:

Não implementar a IA internamente.

A aplicação será responsável pela interface, armazenamento, controle de créditos, comunicação com a API e gerenciamento do job.

A geração será realizada pelo provedor externo.

---

# 5. SEEDANCE

A plataforma deverá ser arquitetada para suportar Seedance através da fal.ai.

Utilizar inicialmente o Seedance 2.0 caso esteja disponível e habilitado no provedor no momento da implementação.

NÃO assumir que Seedance 2.5 está disponível.

A arquitetura deve permitir adicionar posteriormente:

- Seedance 2.5
- Novas versões do Seedance
- Novos modelos de vídeo

sem alterar a estrutura principal da aplicação.

---

# 6. LIP SYNC

Adicionar integração com modelo de Lip Sync disponível pela fal.ai, inicialmente Sync.

O fluxo deverá permitir:

- Upload da imagem/vídeo/personagem
- Upload ou seleção de áudio
- Processamento
- Resultado
- Histórico
- Download

---

# 7. UPSCALE

Adicionar ferramenta de upscale de vídeo através de modelo disponível pela fal.ai.

O usuário deverá:

- Enviar vídeo
- Escolher configuração disponível
- Processar
- Receber resultado
- Baixar arquivo

---

# 8. MODELOS/PERSONAGENS

A plataforma deverá possuir uma estrutura de catálogo de modelos/personagens.

Cada modelo poderá possuir:

- Nome
- Descrição
- Imagem de apresentação
- Status
- Preço
- Tipo
- Categoria
- Tags
- Arquivo/referência necessária
- Data de criação
- Data de atualização

Poderão existir:

- Personagens de IA
- Modelos reais
- Modelos premium

IMPORTANTE:

Para modelos reais, o sistema deve pressupor que existe autorização adequada para uso comercial da imagem.

A plataforma não deverá presumir que qualquer imagem de pessoa real pode ser utilizada comercialmente.

---

# 9. CRÉDITOS

Criar um sistema robusto de créditos.

O usuário deverá possuir:

- Saldo atual
- Histórico de créditos
- Créditos adquiridos
- Créditos consumidos
- Créditos bônus
- Ajustes administrativos

Cada ferramenta possuirá um custo interno definido em créditos.

Exemplo:

- Geração de imagem: X créditos
- Imagem para vídeo: X créditos
- Motion Control: X créditos
- Lip Sync: X créditos
- Upscale: X créditos

Esses valores NÃO devem ficar hardcoded nas interfaces.

Devem ser armazenados/configurados no backend/banco de dados.

---

# 10. USUÁRIOS ILIMITADOS

O administrador deverá conseguir definir usuários com:

- Créditos normais
- Créditos bônus
- Créditos ilimitados

Usuários com créditos ilimitados não devem sofrer desconto de créditos nas gerações.

Essa condição deverá ser controlada pelo backend.

NUNCA confiar apenas em uma condição do frontend para liberar créditos ilimitados.

---

# 11. PAGAMENTOS

O gateway inicial será o VorexPay, caso a conta e API estejam habilitadas para integração.

A arquitetura deverá ser criada de forma abstrata para permitir futuramente:

- VorexPay
- Asaas
- Mercado Pago
- Stripe
- Outros gateways

Não criar toda a lógica financeira diretamente acoplada ao VorexPay.

Criar uma camada de payment provider.

---

# 12. FLUXO DE PAGAMENTO

Fluxo esperado:

Usuário
→ seleciona pacote
→ checkout
→ gateway
→ pagamento
→ webhook
→ backend valida evento
→ identifica pedido
→ confirma pagamento
→ registra transação
→ adiciona créditos
→ registra histórico
→ usuário recebe créditos

IMPORTANTE:

Nunca liberar créditos apenas porque o frontend informou que o pagamento foi realizado.

A confirmação deverá ocorrer através do backend e do mecanismo oficial de confirmação/webhook do gateway.

Implementar proteção contra:

- Webhook duplicado
- Reprocessamento
- Pagamento falso
- Pedido duplicado
- Créditos duplicados

---

# 13. PAINEL ADMINISTRATIVO

Criar painel administrativo completo.

O administrador deverá conseguir:

## Usuários

- Listar
- Pesquisar
- Filtrar
- Visualizar
- Bloquear
- Desbloquear
- Editar
- Visualizar consumo
- Visualizar histórico

## Créditos

- Adicionar
- Remover
- Ajustar
- Definir ilimitado
- Visualizar histórico

## Ferramentas

- Ativar/desativar
- Alterar custo em créditos
- Alterar nome
- Alterar descrição
- Controlar disponibilidade

## Modelos

- Criar
- Editar
- Excluir
- Ativar/desativar
- Definir preço
- Adicionar imagem
- Categorizar

## Gerações

- Visualizar jobs
- Status
- Usuário
- Ferramenta
- Modelo
- Tempo
- Erros
- Consumo

## Pagamentos

- Pedidos
- Status
- Usuário
- Valor
- Gateway
- ID externo
- Data
- Créditos liberados

## Sistema

- Configurações
- Provedores
- Limites
- Custos
- Variáveis de ambiente não devem ser exibidas em texto aberto

---

# 14. ARQUITETURA

A aplicação deverá ser um monorepo/aplicação integrada.

NÃO criar:

- Frontend separado em outro servidor
- Backend separado em outro servidor
- Microsserviços desnecessários
- Kubernetes
- Infraestrutura excessivamente complexa

Utilizar inicialmente:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Node.js runtime
- PostgreSQL
- Prisma
- Docker
- Docker Compose

O frontend e backend deverão estar no mesmo projeto Next.js.

---

# 15. BANCO DE DADOS

Utilizar PostgreSQL.

Utilizar Prisma ORM.

Antes de implementar o banco, gerar documentação completa do modelo de dados.

A documentação deve prever entidades para, no mínimo:

- User
- Session
- Role
- CreditBalance
- CreditTransaction
- AIProvider
- AIModel
- AITool
- AIJob
- AIJobInput
- AIJobOutput
- File
- Generation
- Payment
- PaymentItem
- PaymentWebhook
- Product
- CreditPackage
- Subscription
- Character/Model
- AdminAction
- SystemSetting
- AuditLog

Avaliar se todas as entidades são realmente necessárias e documentar os relacionamentos.

Não criar tabelas sem justificar sua necessidade.

---

# 16. ARQUIVOS

Não armazenar vídeos e imagens diretamente no PostgreSQL.

O banco deve armazenar apenas metadados e referências.

A arquitetura deverá utilizar storage compatível com S3.

Documentar:

- Upload
- Nome
- MIME type
- Tamanho
- URL
- Storage key
- Proprietário
- Tipo
- Status
- Data de expiração, quando aplicável

---

# 17. JOBS DE IA

As gerações de IA são assíncronas.

Não manter uma requisição HTTP aberta esperando a IA terminar.

Criar conceito de Job.

Status possíveis:

- pending
- processing
- completed
- failed
- cancelled

O job deverá possuir:

- usuário
- ferramenta
- modelo
- provider
- custo em créditos
- custo estimado da API
- input
- output
- provider job ID
- timestamps
- erro

---

# 18. WEBHOOKS

Criar endpoints próprios para receber webhooks.

Os webhooks deverão ser:

- Autenticados/validados
- Idempotentes
- Registrados
- Reprocessáveis quando necessário
- Associados ao job correto

Documentar o fluxo de:

fal.ai
→ webhook
→ backend
→ job
→ arquivo
→ créditos
→ histórico

E:

VorexPay
→ webhook
→ backend
→ pagamento
→ créditos

---

# 19. SEGURANÇA

Documentar e implementar:

- Hash seguro de senhas
- Sessões seguras
- Controle de acesso por função
- RBAC
- Validação de entrada
- Zod
- Rate limiting quando necessário
- Proteção contra upload malicioso
- Limite de tamanho de arquivos
- Validação MIME
- Proteção de endpoints administrativos
- Proteção de webhooks
- Sanitização
- Proteção de variáveis de ambiente
- Nunca expor API keys no frontend
- Nunca expor credenciais de gateway
- Logs de ações administrativas

---

# 20. API INTERNA

Documentar todos os endpoints internos da aplicação.

Para cada endpoint informar:

- Método
- URL
- Autenticação
- Permissão
- Request
- Response
- Erros
- Validações

Organizar por:

- Auth
- Users
- Credits
- AI
- Jobs
- Files
- Payments
- Models
- Admin

---

# 21. FRONTEND

Criar documentação de arquitetura visual.

Definir:

- Layout
- Navegação
- Sidebar
- Header
- Dashboard
- Cards
- Modais
- Formulários
- Upload
- Loading states
- Empty states
- Error states
- Toasts
- Responsividade
- Mobile
- Desktop

Utilizar Tailwind CSS.

Utilizar componentes reutilizáveis.

Não criar componentes gigantes.

---

# 22. IDENTIDADE VISUAL

A identidade visual definitiva ainda poderá ser fornecida posteriormente pelo CONTRATANTE.

Enquanto isso, a plataforma poderá utilizar uma identidade visual provisória criada com IA.

A direção visual inicial poderá utilizar:

- Vermelho como cor principal
- Preto/grafite
- Branco
- Tons neutros

A identidade deverá ser facilmente substituível posteriormente.

Não espalhar cores hardcoded pela aplicação.

Criar tokens de design.

---

# 23. LANDING PAGE

A aplicação também terá uma landing page/página de vendas.

Ela deverá possuir estrutura independente dos componentes internos do dashboard, mas poderá reutilizar componentes visuais.

A landing page deverá contemplar, conforme definição posterior:

- Hero
- Apresentação do produto
- Benefícios
- Ferramentas
- Demonstrações
- Modelos/personagens
- Créditos/planos
- CTA
- FAQ
- Rodapé

Não inventar informações comerciais que não tenham sido definidas.

---

# 24. RESPONSIVIDADE

Toda a aplicação deverá funcionar em:

- Desktop
- Notebook
- Tablet
- Mobile

O dashboard não poderá depender exclusivamente de layout desktop.

---

# 25. OBSERVAÇÃO SOBRE TIKTOK

A ideia original inclui possibilidade de utilizar vídeos de referência provenientes do TikTok.

NÃO implementar automaticamente download de qualquer vídeo do TikTok sem validar previamente uma integração oficial ou serviço compatível e permitido.

Inicialmente, o sistema deverá aceitar upload de vídeo de referência.

A possibilidade de entrada por URL deverá ser documentada como funcionalidade futura/dependente de validação técnica e jurídica.

---

# 26. CUSTOS DE IA

A plataforma não deverá assumir que o custo da IA é fixo.

O sistema deverá permitir registrar:

- Provider
- Model
- Unit
- Provider cost
- Internal credit cost

O objetivo é futuramente permitir que o administrador consiga alterar o custo interno de créditos sem alterar código.

---

# 27. DOCKER

Toda a aplicação deverá ser executável através de Docker.

Criar:

- Dockerfile
- docker-compose.yml
- .dockerignore
- .env.example

Documentar:

- Desenvolvimento
- Build
- Produção
- Banco
- Migrations
- Seeds
- Variáveis de ambiente
- Backup

Não colocar secrets no repositório.

---

# 28. ENVIRONMENT VARIABLES

Criar documentação completa das variáveis de ambiente.

Exemplos:

DATABASE_URL
AUTH_SECRET
FAL_KEY
VOREXPAY_API_KEY
VOREXPAY_WEBHOOK_SECRET
STORAGE_ENDPOINT
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
STORAGE_BUCKET

Os valores reais nunca devem ser escritos na documentação.

---

# 29. TESTES

Definir estratégia para:

- Unit tests
- Integration tests
- API tests
- Authentication tests
- Credit tests
- Payment webhook tests
- AI job tests
- Admin authorization tests
- E2E tests

Testar principalmente:

- Créditos não podem ficar negativos
- Créditos não podem ser duplicados
- Webhook duplicado não pode duplicar créditos
- Usuário comum não acessa admin
- Usuário ilimitado não perde créditos
- Pagamento falso não libera créditos
- Job falho deve tratar crédito corretamente conforme regra definida
- Arquivo não pode ser acessado por outro usuário

---

# 30. LOGS E AUDITORIA

Criar estratégia de logs.

Registrar ações críticas:

- Login
- Alteração de créditos
- Usuário bloqueado
- Alteração administrativa
- Pagamento
- Webhook
- Geração
- Falha de geração
- Alteração de configuração

Criar AuditLog para ações administrativas importantes.

---

# 31. BACKUP E RECUPERAÇÃO

Documentar:

- Backup PostgreSQL
- Backup de arquivos
- Frequência
- Retenção
- Restauração
- Procedimento em caso de falha

Não assumir que Docker sozinho é backup.

---

# 32. REGRAS DE DESENVOLVIMENTO

Durante todo o projeto:

1. Não implementar funcionalidades que não estejam documentadas.
2. Não alterar arquitetura sem registrar a decisão.
3. Não adicionar dependências sem justificar.
4. Não criar microsserviços sem necessidade.
5. Não duplicar lógica.
6. Não colocar regras de negócio somente no frontend.
7. Toda regra importante deve existir no backend.
8. Não expor secrets.
9. Não hardcodar custos de IA.
10. Não hardcodar permissões.
11. Não liberar créditos através de lógica somente no frontend.
12. Não considerar pagamento aprovado sem confirmação confiável.
13. Não apagar dados importantes sem estratégia.
14. Não alterar o banco manualmente sem migration.
15. Não criar tabela sem documentação.
16. Não criar endpoint sem documentação.
17. Não criar tela sem definir seu objetivo e fluxo.
18. Não implementar novas funcionalidades por iniciativa própria.
19. Se houver ambiguidade, registrar a dúvida na documentação e solicitar decisão.
20. Se uma decisão técnica precisar mudar, registrar em DECISIONS.md.

---

# 33. DOCUMENTAÇÃO OBRIGATÓRIA

Antes de escrever código, crie dentro de `/docs`:

```text
/docs
├── README.md
├── PROJECT_OVERVIEW.md
├── REQUIREMENTS.md
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── FRONTEND.md
├── BACKEND.md
├── AI_INTEGRATIONS.md
├── PAYMENTS.md
├── CREDITS.md
├── ADMIN_PANEL.md
├── FILE_STORAGE.md
├── SECURITY.md
├── TESTING.md
├── DOCKER.md
├── DEPLOYMENT.md
├── BACKUP.md
├── DESIGN_SYSTEM.md
├── LANDING_PAGE.md
├── ROADMAP.md
├── DEVELOPMENT_RULES.md
├── DECISIONS.md
└── CHANGELOG.md
```

---

# 34. ROADMAP

Criar roadmap separado em:

## Fase 0
Documentação e arquitetura.

## Fase 1
Fundação do projeto.

## Fase 2
Autenticação.

## Fase 3
Banco e créditos.

## Fase 4
Integração fal.ai.

## Fase 5
Ferramentas de IA.

## Fase 6
Pagamentos.

## Fase 7
Painel administrativo.

## Fase 8
Landing page.

## Fase 9
Testes.

## Fase 10
Deploy.

## Futuro

- Novos modelos
- Seedance 2.5 quando houver API compatível
- Workflows
- Assinaturas
- Marketplace avançado
- Split de pagamentos
- Mais ferramentas
- Integrações adicionais

---

# 35. DECISÕES TÉCNICAS

Toda decisão importante deverá ser registrada em:

`/docs/DECISIONS.md`

Formato:

```text
DECISION-001
Data:
Decisão:
Motivo:
Alternativas consideradas:
Consequências:
```

---

# 36. REGRA FUNDAMENTAL

Neste momento:

NÃO escreva código de produção.

NÃO crie telas finais.

NÃO faça migrations definitivas.

NÃO instale dezenas de dependências.

NÃO implemente APIs.

NÃO tente "adiantar" funcionalidades.

Primeiro:

1. Analise o escopo.
2. Identifique ambiguidades.
3. Defina a arquitetura.
4. Defina o banco.
5. Defina os fluxos.
6. Defina as integrações.
7. Crie toda a documentação.
8. Crie o roadmap.
9. Registre as decisões.
10. Apresente um resumo final para aprovação.

Somente depois da aprovação da documentação começaremos a implementação.

Ao terminar a documentação, responda com:

- Arquitetura escolhida
- Stack
- Estrutura do banco
- Integrações
- Estrutura de pastas
- Principais fluxos
- Riscos identificados
- Ambiguidades que precisam de decisão
- Roadmap
- Lista de documentos criados

NÃO comece o desenvolvimento até receber autorização explícita.