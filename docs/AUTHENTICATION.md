# AUTHENTICATION & AUTHORIZATION SPECIFICATION - VORIXA

Este documento detalha o sistema de autenticação, controle de acesso baseado em cargos (RBAC) e orquestração de sessões do VORIXA.

## 1. Arquitetura de Autenticação

A plataforma adota o **Auth.js v5 (NextAuth.js@beta)** como biblioteca de autenticação nativa do Next.js (App Router).

* **Orquestração de Sessão**: Stateless baseada em **JSON Web Tokens (JWT)** auto-suficientes e criptografados. As sessões não exigem armazenamento persistente local ou em banco de dados para leitura, garantindo escalabilidade horizontal de instâncias HTTP.
* **Segurança de Criptografia**: As senhas são processadas no backend via algoritmo **bcryptjs** com fator de custo de 12 e comparadas em tempo de login.
* **Drivers do Banco (Prisma 7)**: O adaptador oficial do Prisma integra-se com a conexão configurada via driver `pg` nativo e adapter `PrismaPg`.

---

## 2. Fluxos de Login

### 2.1 E-mail e Senha
* **Cadastro**: O formulário do cliente `/register` envia as credenciais juntamente com os parâmetros de UTM capturados da URL. O backend valida via Zod, calcula o hash seguro da senha, cria o usuário associando um saldo inicial de boas-vindas e inicia a sessão JWT automática.
* **Login**: O formulário `/login` valida as credenciais via provedor `Credentials`.
* **Proteção Contra Contas Duplicadas**: O e-mail do usuário é uma chave primária única. Tentativas de cadastrar um e-mail já existente retornam a mensagem de erro específica: `"Este e-mail já está cadastrado em nossa base."`.

### 2.2 Google OAuth 2.0
* **Fluxo**: Ao clicar em "Continuar com Google", o NextAuth redireciona o cliente para o consentimento de login do Google Cloud.
* **Callback**: O retorno valida o token JWT do Google e localiza/cria a conta correspondente de forma automatizada no banco de dados.
* **Associação Automática**: Se o usuário logar via Google utilizando o mesmo e-mail de uma conta criada anteriormente via e-mail/senha, as contas são associadas automaticamente no banco de dados (`allowDangerousEmailAccountLinking: true`), preservando o saldo de créditos e o histórico de jobs.

---

## 3. Proteção de Rotas e Níveis de Acesso (RBAC)

O controle de fronteira é orquestrado pelo arquivo [proxy.ts](file:///c:/Git/React/VORIXA/proxy.ts) do Next.js (equivalente ao middleware de rotas nas versões anteriores):

* **Rotas Públicas (Acesso Livre)**:
  * `/` (Landing Page)
  * `/login` (Tela de Login)
  * `/register` (Tela de Cadastro)
  * `/recovery-password` (Recuperação de Acesso)
* **Área do Cliente (Requer Autenticação)**:
  * `/dashboard/*` (Painel central do cliente)
  * `/tools/*` (Interfaces de geração de IA)
  * `/credits/*` (Checkout e pacotes de crédito)
* **Área Administrativa (Requer role === 'ADMIN')**:
  * `/admin/*` (Painel do administrador e estatísticas de cobrança)
  * `/api/admin/*` (APIs restritas de auditoria e liberação de saldo)

---

## 4. Variáveis de Ambiente Necessárias (Google OAuth)

Para habilitar a integração com o Google OAuth, o administrador deve cadastrar no `.env` do servidor:
* `GOOGLE_CLIENT_ID`: ID obtido no painel do desenvolvedor Google Cloud.
* `GOOGLE_CLIENT_SECRET`: Chave secreta de credenciais de cliente OAuth.

### Configuração de URLs de Redirect no Google Cloud:
* **Desenvolvimento Local**: `http://localhost:3000/api/auth/callback/google`
* **Produção**: `https://dominio-do-vorex.com/api/auth/callback/google` (Substituir placeholder após deploy final).
