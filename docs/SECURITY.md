# SECURITY SPECIFICATION - VORIXA

Este documento reúne os padrões de segurança e conformidade aplicados na plataforma VORIXA.

## 1. Autenticação e Criptografia de Dados

* **Armazenamento de Senhas**: As senhas de usuários são submetidas a hash usando o algoritmo **bcryptjs** (para estabilidade multiplataforma) com fator de custo de 12 no backend antes da persistência no banco PostgreSQL.
* **Sessão Segura**: O sistema de sessão utiliza **JSON Web Tokens (JWT)** assinados de forma stateless com expiração definida para 7 dias, transmitidos por meio de cookies seguros (`HttpOnly`, `Secure`, `SameSite=Lax`).
* **Proteção de Rotas (RBAC)**: O acesso às rotas do sistema é controlado pelo arquivo de entrada de borda [proxy.ts](file:///c:/Git/React/VORIXA/proxy.ts) que valida a presença da sessão e as permissões de acesso do usuário. A rota `/admin` e qualquer rota de API `/api/admin/*` retornam HTTP 403 / Forbidden se o usuário não contiver `role === 'ADMIN'`.
* **Proteção Contra Brute Force**: Os endpoints de login e cadastro `/api/auth/*` são protegidos por rate limiting por IP de origem, limitando o envio a no máximo 5 tentativas malsucedidas de login por minuto antes do bloqueio temporário do IP por 15 minutos.

---

## 2. Proteção de Endpoints e Validações

* **Validação de Entrada (Zod)**: Nenhuma entrada externa (payload JSON, query strings ou parâmetros de URL) é aceita sem passar por validação estrutural do Zod.
* **Sanitização de Strings**: Evitar ataques de injeção XSS aplicando sanitização em todos os campos de texto abertos (como nome do usuário e prompts de geração de IA).
* **Prevenção de Path Traversal**: No upload de arquivos, o nome de arquivo original fornecido pelo usuário é limpo e concatenado com um identificador de diretório do usuário baseado em UUID. Caminhos como `../` ou caminhos absolutos são descartados.

---

## 3. Segurança de Integrações de Terceiros

* **Chaves de API Privadas**: Todas as chaves e secrets (`FAL_KEY`, `DATABASE_URL`, `VOREXPAY_API_KEY`) permanecem armazenadas no ambiente do servidor (lado backend) e nunca são expostas na árvore DOM ou pacotes JS enviados ao navegador do cliente.
* **Assinatura de Webhooks**:
  * **fal.ai**: Os payloads de retorno assíncronos das gerações contêm assinaturas criptográficas transmitidas no header `x-fal-signature`. A validação é operada no servidor verificando se o token corresponde à assinatura válida. Em ambiente live, a assinatura deve corresponder ao padrão HMAC/RSA validado contra as chaves públicas obtidas do endpoint oficial de JWKS do fal.ai (`https://rest.alpha.fal.ai/.well-known/jwks.json`). Tentativas sem assinatura ou contendo tokens inválidos são rejeitadas imediatamente com HTTP 401 Unauthorized.
  * **VorexPay**: Os webhooks de atualização de faturas devem conter a assinatura HmacSHA256 gerada a partir do corpo da requisição e da chave secreta `VOREXPAY_WEBHOOK_SECRET`.
* **Segurança Zero Trust**: O backend nunca confia em parâmetros de preço, custo de crédito, saldo ou permissões enviados pelo cliente frontend. Toda operação financeira é calculada e revalidada no servidor usando apenas o ID da sessão autenticada.

---

## 4. Auditoria, Logs e Detecção de Fraude

* **Logs de Auditoria**: Qualquer ação administrativa crítica (como adicionar/remover créditos manualmente, bloquear usuários, alterar custos de ferramentas de IA ou atualizar configurações de SEO do branding) gera um registro na tabela `AuditLog` mapeando o IP de origem, data, User Agent, ID do administrador e os dados pré e pós-alteração.
* **Mapeamento Antifraude**: A arquitetura registra metadados de requisições de recargas e conexões de rede para detecção de anomalias (ex: múltiplos cadastros originados do mesmo contexto técnico, picos incomuns de consumo de créditos em poucos segundos, ou falhas sequenciais de pagamento).
* **Rate Limiting Configurável**: Implementado em endpoints estratégicos (login, cadastro, recuperação de senha, checkout, uploads e geração de IA) combinando as chaves de:
  * IP de origem.
  * ID do Usuário autenticado.
  * Rota do Endpoint acessado.
