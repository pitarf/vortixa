# VORIXA - Testes e Funcionalidades Pendentes de Segurança

Este arquivo rastreia itens de segurança identificados durante as auditorias que requerem validação ou implementação futura, pois dependem de credenciais reais, integração futura, ou ampliariam o escopo da auditoria no momento de sua descoberta.

## Regra Absoluta

Nunca remover um item deste arquivo simplesmente porque foi analisado.
Um item só pode sair da lista depois de:
1. ser efetivamente implementado;
2. ser efetivamente testado;
3. possuir evidência;
4. ser marcado como concluído;
5. ter o registro da data/fase/auditoria que o validou.

---

## 1. Timeout e Controle de Recursos no StorageService (Auditoria 14.4.2)
- **Descoberta:** O `StorageService` realiza o download de imagens e vídeos externos via `fetch()`. No entanto, não há um timeout absoluto rigoroso configurado nativamente nem um controle explícito do tamanho do `Buffer` (`response.arrayBuffer()`) processado em memória ou bloqueio de downloads muito grandes (evitando exaustão de memória/disco em casos onde o provider envie gigabytes de dados).
- **Ação Pendente:** Implementar restrições de tamanho na stream ou limites de memória com `AbortController` durante o consumo da resposta HTTP da fal.ai, e validar este limite.
- **Status:** PENDENTE de implementação e teste em fase futura.

## 2. Google OAuth e Account Linking Real (Auditoria 14.1)
- **Descoberta:** O `GoogleProvider` foi inspecionado e configurado corretamente (com placeholders), mas o comportamento real de redirecionamento, troca de tokens e account linking (mesmo bloqueado) não foi executado em ambiente com chaves de API reais do Google.
- **Ação Pendente:** Testar fluxo end-to-end de login social quando credenciais reais de produção/dev estiverem injetadas no ambiente.
- **Status:** PENDENTE.

## 3. EmailService com Provedor Real - Brevo (Auditorias 14.1 / 14.1.1)
- **Descoberta:** O `EmailService` foi abstraído perfeitamente e o endpoint de recuperação de senha foi inspecionado e testado usando mocks seguros que previnem Enumeração de Usuários. Porém, o disparo de e-mails reais via `api.brevo.com` carece de credenciais para validação.
- **Ação Pendente:** Injetar credenciais da Brevo e testar envio real de tokens transacionais de recuperação de senha.
- **Status:** PENDENTE.

## 4. Webhooks fal.ai em Ambiente Live (Auditoria 14.4.1)
- **Descoberta:** O comportamento do Webhook foi fortemente testado localmente (`TESTADO` via mocks) cobrindo idempotência e assinatura, mas requisições provenientes diretamente dos servidores originais da fal.ai exigirão infraestrutura pública (ngrok/domínio) para homologação final.
- **Ação Pendente:** Homologar recebimento de webhook em ambiente de staging/produção com chaves assinadas nativas emitidas pela fal.ai.
- **Status:** PENDENTE.

## 5. Homologação Real de Strict-Transport-Security (HSTS) e HTTPS (Auditoria 14.5.1)
- **Descoberta:** Os cabeçalhos de segurança (HSTS e CSP) foram testados em requisições HTTP reais localmente (`localhost:3000`) confirmando sua entrega pelo backend Next.js. Contudo, o HSTS requer efetividade comprovada em um ambiente com certificado SSL/TLS de produção (HTTPS real), domínio e, caso aplicável, submissão para a lista de preload dos navegadores.
- **Ação Pendente:** Validar recebimento de `Strict-Transport-Security` em ambiente produtivo/staging com HTTPS ativo e certificar que a diretiva `includeSubDomains; preload` é honrada pelo browser e proxy reverso.
- **Status:** PENDENTE.
