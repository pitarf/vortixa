# DATABASE - VORIXA

Este documento detalha o modelo de dados físico e lógico do banco de dados PostgreSQL utilizando o **Prisma ORM**.

## 1. Dicionário de Entidades (Tabelas)

Abaixo estão justificadas as entidades propostas para o modelo do banco de dados:

* **User**: Cadastro de contas de usuários (e-mail, senha crypt, perfil, papel de acesso).
* **Role**: Papel do usuário no sistema (Administrador, Usuário comum). Mapeado via enum no Prisma.
* **CreditBalance**: Saldo atualizado de créditos do usuário (separado para controle e travamento de concorrência).
* **CreditTransaction**: Histórico imutável de todas as movimentações de créditos (compra, débito de geração, estorno, bônus, ajuste manual).
* **AIProvider**: Cadastro de provedores (ex: fal.ai, Replicate) para facilitar controle de chaves e status de disponibilidade.
* **AITool**: Cadastro de ferramentas disponíveis nas telas (gerador de imagens, motion control, lip sync). Possui relação com `AIModel`.
* **AIModel**: Modelos de IA suportados (FLUX.1, Kling, Sync, etc.) com seus respectivos custos e provedores.
* **AIJob**: Registro de execução assíncrona da IA com status (`pending`, `processing`, `completed`, `failed`).
* **AIJobInput / AIJobOutput**: Armazenamento dos parâmetros e resultados gerados (imagens, vídeos).
* **File**: Metadados de arquivos enviados ou gerados (chave do S3, tamanho, MIME type, URL pública).
* **Payment**: Registro de pedidos e transações financeiras geradas por gateway.
* **PaymentWebhook**: Registro histórico de payloads recebidos dos gateways para auditoria e idempotência.
* **SystemSetting**: Configurações dinâmicas de branding e SEO (ex: `siteTitle`, `siteDescription`, `faviconUrl`) editáveis pelo painel admin.
* **AuditLog**: Histórico de ações de administradores no sistema.

---

## 2. Esquema do Prisma ORM (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum CreditTransactionType {
  PURCHASE
  GENERATION_DEBIT
  GENERATION_REFUND
  BONUS
  ADMIN_ADJUSTMENT
}

model User {
  id                String              @id @default(uuid())
  email             String              @unique
  passwordHash      String
  name              String
  role              Role                @default(USER)
  isUnlimited       Boolean             @default(false)
  
  // Rastreamento de Marketing (UTMs)
  utmSource         String?
  utmMedium         String?
  utmCampaign       String?
  utmContent        String?
  utmTerm           String?
  referrer          String?

  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  creditBalance     CreditBalance?
  creditTransactions CreditTransaction[]
  jobs              AIJob[]
  payments          Payment[]
  files             File[]
  auditLogs         AuditLog[]

  @@index([createdAt])
}

model CreditBalance {
  id         String   @id @default(uuid())
  userId     String   @unique
  balance    Int      @default(0)
  updatedAt  DateTime @updatedAt
  
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CreditTransaction {
  id         String                @id @default(uuid())
  userId     String
  amount     Int                   // Positivo para acréscimo, negativo para débito
  type       CreditTransactionType
  description String?
  jobId      String?               @unique
  paymentId  String?               @unique
  createdAt  DateTime              @default(now())
  
  user       User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  job        AIJob?                @relation(fields: [jobId], references: [id], onDelete: SetNull)
  payment    Payment?              @relation(fields: [paymentId], references: [id], onDelete: SetNull)

  @@index([userId, createdAt])
}

model AIProvider {
  id        String    @id @default(uuid())
  name      String    @unique
  status    Boolean   @default(true)
  models    AIModel[]
}

model AIModel {
  id            String      @id @default(uuid())
  providerId    String
  name          String
  technicalName String      // Nome do modelo na fal.ai (ex: "fal-ai/flux/schnell")
  creditCost    Int         // Custo em créditos internos para o usuário
  apiUnitCost   Float       // Custo estimado em dólares na API fal.ai por geração
  status        Boolean     @default(true)
  
  provider      AIProvider  @relation(fields: [providerId], references: [id])
  tools         AITool[]
  jobs          AIJob[]
}

model AITool {
  id          String    @id @default(uuid())
  modelId     String
  name        String
  description String?
  slug        String    @unique // Identificador na URL (ex: "motion-control")
  status      Boolean   @default(true)
  
  model       AIModel   @relation(fields: [modelId], references: [id])
  jobs        AIJob[]
}

model AIJob {
  id            String             @id @default(uuid())
  userId        String
  modelId       String
  toolId        String
  status        JobStatus          @default(PENDING)
  providerJobId String?            @unique // ID do job na fal.ai
  creditCost    Int
  apiUnitCost   Float
  error         String?
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  
  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  model         AIModel            @relation(fields: [modelId], references: [id])
  tool          AITool             @relation(fields: [toolId], references: [id])
  inputs        AIJobInput[]
  outputs       AIJobOutput[]
  creditTx      CreditTransaction?

  @@index([userId, status])
  @@index([providerJobId])
}

model AIJobInput {
  id        String   @id @default(uuid())
  jobId     String
  key       String   // Nome do parâmetro (ex: "prompt")
  value     String   // Valor do parâmetro (ou URL de arquivo)
  
  job       AIJob    @relation(fields: [jobId], references: [id], onDelete: Cascade)
}

model AIJobOutput {
  id        String   @id @default(uuid())
  jobId     String
  fileUrl   String
  fileId    String?  @unique
  
  job       AIJob    @relation(fields: [jobId], references: [id], onDelete: Cascade)
  file      File?    @relation(fields: [fileId], references: [id], onDelete: SetNull)
}

model File {
  id          String       @id @default(uuid())
  userId      String
  name        String
  mimeType    String
  sizeBytes   Int
  url         String
  storageKey  String       @unique // Caminho de busca no S3 (ex: "uploads/user-id/abc.mp4")
  createdAt   DateTime     @default(now())
  
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobOutput   AIJobOutput?
}

model Payment {
  id             String             @id @default(uuid())
  userId         String
  amountBRL      Float
  creditsGranted Int
  status         PaymentStatus      @default(PENDING)
  gateway        String             // "vorexpay", "stripe", etc.
  gatewayTxId    String?            @unique // ID da transação no gateway
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt
  
  user           User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  creditTx       CreditTransaction?
}

model PaymentWebhook {
  id          String   @id @default(uuid())
  gateway     String
  gatewayEventId String @unique // Usado para evitar reprocessamento de webhooks
  payload     String   // JSON completo recebido
  processed   Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model SystemSetting {
  id          String   @id @default(uuid())
  key         String   @unique // ex: "siteTitle", "siteDescription", "faviconUrl"
  value       String
  updatedAt   DateTime @updatedAt
}

model AuditLog {
  id          String   @id @default(uuid())
  userId      String
  action      String   // Ação realizada (ex: "UPDATE_CREDITS", "BLOCK_USER")
  details     String?  // Detalhes da alteração
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
