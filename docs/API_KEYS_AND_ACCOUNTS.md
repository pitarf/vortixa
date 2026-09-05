# GUIA DE CHAVES DE API, CONTAS E ATIVAÇÃO EM PRODUÇÃO — VORIXA

Este documento reúne **tudo o que é necessário configurar externamente** para colocar o VORIXA em operação real com pagamentos, inteligência artificial, autenticação Google, armazenamento na nuvem e envio de e-mails.

---

## 1. Checklist Rápido de Serviços

| Serviço | Finalidade | Status / Chaves Necessárias |
| :--- | :--- | :--- |
| **fal.ai** | Motores de IA (FLUX.1, Kling AI 1.5, LivePortrait, Upscale 4K) | `FAL_KEY` |
| **Mercado Pago** | Gateway de Pagamentos no Brasil (Pix e Cartão de Crédito) | `MERCADOPAGO_ACCESS_KEY`, `MERCADOPAGO_WEBHOOK_SECRET` |
| **Stripe** *(Opcional/Global)* | Gateway de Pagamentos Internacional | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Google Cloud Console** | Login Social "Entrar com Google" (OAuth 2.0) | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |
| **Cloudflare R2** *(ou AWS S3)* | Armazenamento seguro de imagens e vídeos gerados | `STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`, `STORAGE_BUCKET` |
| **Resend** *(ou SMTP)* | Envio de e-mails de recuperação de senha | `RESEND_API_KEY`, `EMAIL_FROM` |
| **Banco de Dados PostgreSQL** | Persistência de usuários, créditos, jobs e nós de Flow | `DATABASE_URL` |
| **Chave de Criptografia JWT** | Assinatura de sessões de usuário com Auth.js | `AUTH_SECRET` |

---

## 2. Passo a Passo Detalhado para Criar Contas e Obter Chaves

### 2.1. Motores de IA — fal.ai (`FAL_KEY`)
1. Acesse [fal.ai](https://fal.ai) e clique em **Sign In** (pode logar com GitHub ou E-mail).
2. Adicione créditos na carteira da fal.ai (mínimo de US$ 10 para testes).
3. Vá em **Keys** (ou **API Keys**) no menu lateral.
4. Clique em **Add Key** e dê o nome `VORIXA_PROD`.
5. Copie a chave gerada (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).
6. Preencha no seu `.env`:
   ```env
   FAL_KEY="sua-chave-fal-ai-aqui"
   ```

---

### 2.2. Gateway de Pagamentos — Mercado Pago (Pix e Cartão)
1. Acesse o [Painel do Desenvolvedor do Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2. Faça login com sua conta do Mercado Pago.
3. Clique em **Criar aplicação**.
   - **Nome**: `VORIXA Pagamentos`
   - **Tipo de solução**: *Pagamentos no checkout*
4. Acesse a aba **Credenciais de produção** (ou **Credenciais de teste** para homologação):
   - Copie o **Access Token** (`APP_USR-...`).
   - Copie a **Public Key** (`APP_USR-...`).
5. Configure o Webhook do Mercado Pago:
   - Vá em **Webhooks / Notificações IPN**.
   - URL de Notificação: `https://seudominio.com/api/webhooks/payment?provider=mercadopago`
   - Eventos selecionados: `Pagamentos` (`payment.created`, `payment.updated`).
   - Copie a **Chave Secreta de Assinatura (Webhook Secret)**.
6. Preencha no seu `.env`:
   ```env
   PAYMENT_PROVIDER="mercadopago"
   PAYMENT_PROVIDER_MODE="live"
   MERCADOPAGO_ACCESS_KEY="APP_USR-..."
   MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
   MERCADOPAGO_WEBHOOK_SECRET="seu-secret-de-webhook-mp"
   MERCADOPAGO_SANDBOX="false"
   ```

---

### 2.3. Gateway de Pagamentos — Stripe *(Se desejar cobrar em escala global)*
1. Acesse o [Dashboard da Stripe](https://dashboard.stripe.com/).
2. Em **Developers > API Keys**, copie a **Secret Key** (`sk_live_...` ou `sk_test_...`) e a **Publishable Key** (`pk_live_...`).
3. Em **Developers > Webhooks**, clique em **Add Endpoint**:
   - URL do Endpoint: `https://seudominio.com/api/webhooks/payment?provider=stripe`
   - Eventos: `checkout.session.completed`, `charge.refunded`, `payment_intent.payment_failed`.
   - Clique em **Reveal Secret** no endpoint criado para copiar o `Signing Secret` (`whsec_...`).
4. Preencha no seu `.env`:
   ```env
   PAYMENT_PROVIDER="stripe"
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_PUBLIC_KEY="pk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

---

### 2.4. Login Social — Google OAuth 2.0 (`AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`)
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto chamado `VORIXA`.
3. Vá em **APIs & Services > OAuth consent screen**:
   - Selecione **External** e preencha o nome do app (`VORIXA`) e e-mail de suporte.
4. Vá em **APIs & Services > Credentials**:
   - Clique em **Create Credentials > OAuth client ID**.
   - Application type: **Web application**.
   - **Authorized JavaScript origins**: `https://seudominio.com` (e `http://localhost:3000` para dev).
   - **Authorized redirect URIs**: `https://seudominio.com/api/auth/callback/google` (e `http://localhost:3000/api/auth/callback/google` para dev).
5. Copie o **Client ID** e o **Client Secret**.
6. Preencha no seu `.env`:
   ```env
   AUTH_GOOGLE_ID="seu-client-id.apps.googleusercontent.com"
   AUTH_GOOGLE_SECRET="seu-client-secret"
   ```

---

### 2.5. Armazenamento de Arquivos — Cloudflare R2 *(Recomendado por ter zero taxa de download/egress)*
1. Acesse o [Painel da Cloudflare](https://dash.cloudflare.com/) e vá na seção **R2**.
2. Clique em **Create Bucket** com o nome `vorixa-files`.
3. Em **Manage R2 API Tokens**, clique em **Create API Token**:
   - Permissões: *Object Read & Write*.
   - Copie o **Access Key ID**, o **Secret Access Key** e o **Endpoint S3 API**.
4. Preencha no seu `.env`:
   ```env
   STORAGE_ENDPOINT="https://<seu-account-id>.r2.cloudflarestorage.com"
   STORAGE_ACCESS_KEY="sua-access-key-r2"
   STORAGE_SECRET_KEY="sua-secret-key-r2"
   STORAGE_BUCKET="vorixa-files"
   ```

*(Nota: Para desenvolvimento local, o `docker-compose.yml` já sobe automaticamente o MinIO configurado).*

---

### 2.6. Envio Transacional de E-mails — Resend
1. Crie uma conta em [resend.com](https://resend.com).
2. Adicione e verifique seu domínio (ex: `vorixa.com`).
3. Vá em **API Keys** e crie uma chave `VORIXA_APP`.
4. Preencha no seu `.env`:
   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxxxx"
   EMAIL_FROM="VORIXA <contato@seudominio.com>"
   ```

---

### 2.7. Chaves Internas e Banco de Dados

#### Criptografia de Sessão (`AUTH_SECRET`)
Gere uma chave hexadecimal de 32 bytes no terminal:
```bash
openssl rand -hex 32
```
Ou no PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

#### URL do PostgreSQL (`DATABASE_URL`)
```env
DATABASE_URL="postgresql://vorixa_user:vorixa_password@localhost:5432/vorixa_db?schema=public&connection_limit=10"
```

---

## 3. Modelo Final do Arquivo `.env` de Produção

```env
# ==============================================================================
# CONFIGURAÇÕES DE AMBIENTE VORIXA - PRODUÇÃO
# ==============================================================================

# 1. URL DA APLICAÇÃO & NÓS
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_APP_URL="https://seudominio.com"
NEXTAUTH_URL="https://seudominio.com"

# 2. BANCO DE DADOS POSTGRESQL
DATABASE_URL="postgresql://usuario:senha@host:5432/vorixa_db?schema=public&sslmode=prefer"

# 3. CRIPTOGRAFIA DE SESSÃO / AUTH.JS
AUTH_SECRET="gerado-via-openssl-rand-hex-32"

# 4. GOOGLE OAUTH
AUTH_GOOGLE_ID="xxxxxxxx.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-xxxxxxxx"

# 5. INTELIGÊNCIA ARTIFICIAL (fal.ai)
FAL_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 6. GATEWAY DE PAGAMENTOS (MERCADO PAGO / STRIPE)
PAYMENT_PROVIDER="mercadopago" # ou "stripe"
PAYMENT_PROVIDER_MODE="live"

# Mercado Pago
MERCADOPAGO_ACCESS_KEY="APP_USR-xxxxxxxx"
MERCADOPAGO_PUBLIC_KEY="APP_USR-xxxxxxxx"
MERCADOPAGO_WEBHOOK_SECRET="xxxxxxxx"
MERCADOPAGO_SANDBOX="false"

# Stripe (Opcional)
STRIPE_SECRET_KEY="sk_live_xxxxxxxx"
STRIPE_PUBLIC_KEY="pk_live_xxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxx"

# 7. STORAGE CLOUDFLARE R2 / S3
STORAGE_ENDPOINT="https://xxxxxxxx.r2.cloudflarestorage.com"
STORAGE_ACCESS_KEY="xxxxxxxx"
STORAGE_SECRET_KEY="xxxxxxxx"
STORAGE_BUCKET="vorixa-files"

# 8. E-MAIL TRANSACIONAL (RESEND)
RESEND_API_KEY="re_xxxxxxxx"
EMAIL_FROM="VORIXA <no-reply@seudominio.com>"
```

---

## 4. O Que Fazer Depois de Colocar as Chaves?

1. **Rodar as Migrations no Banco de Produção**:
   ```bash
   npx prisma migrate deploy
   ```
2. **Executar o Seed Inicial (Cria o Provedor de IA, Modelos e Pacotes Comerciais)**:
   ```bash
   npx prisma db seed
   ```
3. **Subir com Docker**:
   ```bash
   docker-compose up -d --build
   ```
4. **Criar o Primeiro Usuário Administrador**:
   Cadastre-se na tela `/register` e depois rode no PostgreSQL para virar Admin:
   ```sql
   UPDATE "User" SET role = 'ADMIN', "isUnlimited" = true WHERE email = 'seu-email@dominio.com';
   ```
5. Acesse o Painel em `/dashboard/admin` para gerenciar o branding e monitorar a plataforma.
