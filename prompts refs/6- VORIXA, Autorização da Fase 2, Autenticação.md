A Fase 1 está aprovada.

O ambiente local foi validado com PostgreSQL local, sem dependência obrigatória de Docker ou MinIO, e o build/testes estão funcionando.

Você está autorizado a iniciar a **Fase 2: Autenticação e RBAC**.

Siga rigorosamente a documentação existente em `/docs`.

## 1. OBJETIVO DA FASE 2

Implementar a fundação completa de autenticação e autorização do VORIXA.

A autenticação deverá ser preparada para uma plataforma SaaS que poderá crescer significativamente em número de usuários.

---

# 2. MÉTODOS DE LOGIN

Implementar inicialmente:

### E-mail e senha

- Cadastro
- Login
- Logout
- Recuperação de senha
- Alteração de senha
- Validação de e-mail, caso definida na arquitetura
- Sessão segura

### Google

Implementar:

- "Continuar com Google"
- OAuth 2.0 / OpenID Connect
- Criação automática de usuário no primeiro login
- Login de usuário existente
- Associação da conta Google ao usuário existente quando aplicável
- Logout
- Tratamento seguro de callback
- Proteção contra criação de contas duplicadas

A experiência deverá permitir:

```text
Criar conta
    ↓
E-mail e senha
OU
Continuar com Google
```

---

# 3. ARQUITETURA DE AUTENTICAÇÃO

A solução deverá utilizar uma biblioteca/protocolo consolidado e adequado ao Next.js App Router.

Antes de instalar uma biblioteca de autenticação, verifique as opções compatíveis com a versão atual do projeto e escolha a solução mais adequada.

A autenticação deve permanecer desacoplada da lógica de negócio.

Não criar um sistema de autenticação artesanal se uma solução consolidada atender ao projeto.

---

# 4. MODELO DE USUÁRIO

O modelo de usuário deverá suportar:

- ID interno
- Nome
- E-mail
- E-mail verificado
- Avatar
- Senha armazenada de forma segura, quando aplicável
- Status
- Role
- Data de criação
- Data de atualização
- Último login

Também deverá existir estrutura para identidade/provedor externo.

Não criar campos específicos do Google diretamente no `User` se isso limitar a adição futura de outros provedores.

Preferir uma estrutura como:

```text
User
  ↓
Account / Identity
  ↓
Provider
```

ou equivalente adequado à biblioteca escolhida.

---

# 5. ROLES

Manter inicialmente:

```text
USER
ADMIN
```

O sistema deverá possuir autorização no backend.

Não confiar somente no frontend para proteger áreas administrativas.

Um usuário USER não pode acessar:

```text
/admin
```

mesmo que tente acessar diretamente a URL ou endpoint.

---

# 6. PROTEÇÃO DE ROTAS

Implementar proteção para:

### Público

- Landing page
- Login
- Cadastro
- Recuperação de senha

### Autenticado

- Dashboard
- Perfil
- Histórico
- Ferramentas
- Créditos

### Administrador

- Painel administrativo
- Usuários
- Créditos
- Gerações
- Pagamentos
- Configurações

Documentar claramente as regras de acesso.

---

# 7. GOOGLE OAUTH

Criar estrutura de configuração através de variáveis de ambiente.

Exemplo:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Nunca inserir valores reais no código.

Nunca inserir credenciais no `/docs`.

Nunca inserir credenciais no `.env.example`.

O `.env.example` deverá conter apenas placeholders.

Exemplo:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

# 8. CONTAS DUPLICADAS

Implementar uma regra segura para evitar duplicidade de contas.

Exemplo:

Usuário já possui:

```text
rafael@email.com
```

Depois realiza login com Google utilizando o mesmo endereço.

O sistema não deve criar automaticamente um segundo usuário sem avaliar a identidade existente.

Documentar exatamente a estratégia utilizada para vinculação de contas.

---

# 9. SESSÕES

As sessões devem ser seguras e compatíveis com arquitetura stateless.

Não armazenar sessão exclusivamente na memória do processo Node.js.

Não depender do filesystem do container.

Documentar:

- Criação
- Validação
- Expiração
- Renovação
- Logout
- Revogação

---

# 10. SEGURANÇA

Implementar:

- Hash seguro de senha
- Proteção contra brute force
- Rate limiting nos endpoints de autenticação
- Validação de entrada
- Proteção de callback OAuth
- Cookies seguros
- HttpOnly quando aplicável
- SameSite adequado
- CSRF protection quando necessário
- Proteção de sessão
- Não exposição de credenciais
- Não exposição de tokens
- Validação de permissões no backend

Não armazenar senha em texto puro.

---

# 11. BANCO DE DADOS

Avaliar a estrutura atual do Prisma antes de criar novas tabelas.

Caso sejam necessárias alterações:

1. Atualizar documentação.
2. Atualizar schema.
3. Criar migration.
4. Executar migration.
5. Testar.
6. Registrar a decisão.

Não apagar dados existentes.

---

# 12. UI

Criar as interfaces necessárias para autenticação respeitando integralmente o Design System do VORIXA.

Criar:

- Login
- Cadastro
- Recuperação de senha
- Nova senha
- Estado de carregamento
- Estado de erro
- Estado de sucesso
- Botão "Continuar com Google"

O botão Google deverá seguir o padrão visual adequado, sem alterar a identidade da marca.

Não criar cores ou estilos hardcoded fora do Design System.

---

# 13. GOOGLE LOGIN

O fluxo deverá ser:

```text
Usuário
    ↓
Continuar com Google
    ↓
Google OAuth
    ↓
Callback
    ↓
Validação
    ↓
Localiza ou cria usuário
    ↓
Cria sessão
    ↓
Dashboard
```

Em caso de erro:

```text
Google OAuth
    ↓
Erro
    ↓
Mensagem amigável
    ↓
Login
```

Não expor detalhes técnicos ou secrets ao usuário.

---

# 14. TESTES

Criar testes para pelo menos:

- Cadastro
- Login
- Senha inválida
- Logout
- Proteção de rota
- USER tentando acessar ADMIN
- ADMIN acessando ADMIN
- Criação de usuário via Google
- Login Google de usuário existente
- Prevenção de conta duplicada
- Sessão inválida
- Sessão expirada
- Recuperação de senha
- Rate limiting de autenticação

Testar também casos de erro.

---

# 15. DOCUMENTAÇÃO

Atualizar:

```text
/docs/AUTHENTICATION.md
/docs/SECURITY.md
/docs/DATABASE.md
/docs/API.md
/docs/DEVELOPMENT_RULES.md
/docs/DECISIONS.md
/docs/CHANGELOG.md
```

Criar `AUTHENTICATION.md` caso ainda não exista.

Documentar:

- Arquitetura
- Fluxos
- Google OAuth
- Sessões
- Roles
- Proteção de rotas
- Variáveis de ambiente
- Recuperação de senha
- Segurança
- Testes
- Configuração local
- Configuração futura em produção

---

# 16. GOOGLE CLOUD

Documentar no `MANUAL_DEV.md` o processo necessário para configurar as credenciais OAuth do Google.

Não solicitar que o desenvolvedor coloque credenciais reais no repositório.

Explicar quais URLs de callback/redirect deverão ser cadastradas no Google Cloud para:

- Desenvolvimento local
- Produção

Não inventar URLs definitivas de produção caso o domínio ainda não esteja configurado.

Utilizar placeholders documentados quando necessário.

---

# 17. ESCALABILIDADE

A autenticação deverá funcionar corretamente caso futuramente existam múltiplas instâncias da aplicação.

Não depender de:

- Memória local
- Filesystem local
- Estado local do processo

A solução deverá ser compatível com a arquitetura stateless definida em `/docs/ARCHITECTURE.md`.

---

# 18. NÃO IMPLEMENTAR NESTA FASE

Não implementar ainda:

- Sistema completo de créditos
- Integração fal.ai
- VorexPay
- Ferramentas de geração
- Marketplace
- Assinaturas
- Landing page definitiva

Apenas preparar o necessário para que essas funcionalidades possam utilizar o usuário autenticado posteriormente.

---

# 19. REGRA DE CONTROLE

Não avançar para a Fase 3 automaticamente.

Ao finalizar a Fase 2, apresentar:

- Arquivos criados
- Arquivos modificados
- Dependências adicionadas
- Alterações no banco
- Migrations
- Fluxos de autenticação
- Configuração Google OAuth
- Variáveis de ambiente
- Testes executados
- Resultado dos testes
- Resultado do build
- Problemas encontrados
- Decisões técnicas
- Checklist da Fase 2

Aguardar autorização explícita antes de iniciar a Fase 3.