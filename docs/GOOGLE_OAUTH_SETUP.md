# Guia Passo a Passo: Configuração do Google Login (OAuth 2.0) — VORIXA

Este documento contém o passo a passo completo para o proprietário da aplicação gerar as credenciais oficiais do **Google OAuth 2.0** no Google Cloud Console e ativar o botão **"Entrar com o Google"** na plataforma VORIXA.

---

## 📦 O que precisa ser fornecido ao desenvolvedor

Ao final deste tutorial, você obterá **2 informações** que devem ser inseridas no arquivo de variáveis de ambiente (`.env`):

1. **`AUTH_GOOGLE_ID`** (ID do Cliente OAuth)
2. **`AUTH_GOOGLE_SECRET`** (Chave Secreta do Cliente)

---

## 🚀 Passo a Passo no Google Cloud Console

Tempo estimado: **5 minutos**.

### Passo 1: Acessar o Google Cloud Console e Criar o Projeto
1. Acesse: **[https://console.cloud.google.com/](https://console.cloud.google.com/)**
2. Faça login com a conta Google oficial do projeto ou da empresa.
3. No topo da página (ao lado do logo do Google Cloud), clique no seletor de projetos e selecione **"Novo Projeto"**.
4. Defina o nome do projeto (ex: `VORIXA`) e clique em **Criar**.
5. Certifique-se de que o projeto recém-criado está selecionado no topo da tela.

---

### Passo 2: Configurar a Tela de Consentimento OAuth
1. No menu de navegação à esquerda, vá em **APIs e Serviços** ➜ **Tela de consentimento OAuth** (ou acesse diretamente pelo link: [Tela de Consentimento](https://console.cloud.google.com/apis/credentials/consent)).
2. Selecione o tipo de usuário: **Externo** e clique no botão **Criar**.
3. Preencha as informações obrigatórias da aplicação:
   * **Nome do app:** `VORIXA`
   * **E-mail para suporte do usuário:** Seu e-mail de contato ou suporte.
   * **Logotipo do app (opcional):** Pode subir a logo oficial `public/logos/logo principal.png`.
   * **Domínio do aplicativo (se já tiver domínio público):**
     * *Página inicial do aplicativo:* `https://seudominio.com.br`
     * *Link da política de privacidade:* `https://seudominio.com.br/privacy`
     * *Link dos termos de serviço:* `https://seudominio.com.br/terms`
   * **Dados de contato do desenvolvedor:** Seu e-mail para notificações técnicas.
4. Clique em **Salvar e continuar**.
5. Na aba **Escopos**, clique em **Salvar e continuar** (os escopos padrão `openid`, `email` e `profile` já são suficientes).
6. Na aba **Usuários de teste**, clique em **Salvar e continuar**.
7. Na aba final de **Resumo**, clique em **Voltar para o painel**.
8. **Importante:** No painel da tela de consentimento, em **Status da publicação**, clique no botão **"Publicar aplicativo"** e confirme para permitir que qualquer usuário faça login.

---

### Passo 3: Criar as Credenciais OAuth 2.0 (Client ID e Secret)
1. No menu lateral esquerdo, clique em **Credenciais** (ou acesse: [Credenciais](https://console.cloud.google.com/apis/credentials)).
2. No menu superior, clique em **+ Criar Credenciais** ➜ **ID do cliente OAuth**.
3. Em **Tipo de aplicativo**, selecione: **Aplicativo da Web**.
4. Em **Nome**, defina: `VORIXA Web App`.
5. Em **Origens JavaScript autorizadas**, clique em **+ Adicionar URI** e adicione as URLs de onde as requisições partirão:
   * `http://localhost:3000` *(Ambiente de Desenvolvimento / Testes Locais)*
   * `https://seudominio.com.br` *(Substitua pelo seu domínio oficial em Produção)*
6. Em **URIs de redirecionamento autorizados**, clique em **+ Adicionar URI** e adicione exatamente as URLs de callback do Auth.js / NextAuth:
   * `http://localhost:3000/api/auth/callback/google` *(Para testes locais)*
   * `https://seudominio.com.br/api/auth/callback/google` *(Para produção)*
7. Clique no botão **Criar**.

---

### Passo 4: Coleta das Chaves

Uma janela pop-up será exibida com as suas credenciais. Copie os valores e repasse ao desenvolvedor:

```env
# Cole no arquivo .env da aplicação:
AUTH_GOOGLE_ID="xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

> ⚠️ **Atenção à Segurança:** O `AUTH_GOOGLE_SECRET` é uma chave privada sensível. Nunca a compartilhe em repositórios públicos de código.
