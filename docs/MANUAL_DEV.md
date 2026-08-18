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

