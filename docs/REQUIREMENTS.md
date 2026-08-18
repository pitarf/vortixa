# REQUIREMENTS - VORIXA

Este documento detalha os requisitos e regras de negócio para a implementação da plataforma VORIXA.

## 1. Requisitos Funcionais (RF)

### 1.1 Autenticação e Gestão de Usuários
* **RF-001**: O sistema deve permitir o cadastro de novos usuários contendo nome, e-mail e senha.
* **RF-002**: O sistema deve fornecer login seguro via e-mail/senha e suporte a sessões protegidas (cookies/tokens).
* **RF-003**: O sistema deve permitir recuperação de senha através de envio de e-mail seguro com token temporário.
* **RF-004**: O usuário autenticado deve conseguir editar as informações básicas do seu perfil.
* **RF-005**: O sistema deve implementar controle de acesso baseado em papéis (RBAC - admin, user).

### 1.2 Painel e Geração de IA
* **RF-006**: O Dashboard deve exibir em tempo real o saldo de créditos do usuário.
* **RF-007**: O sistema deve disponibilizar o gerador de imagens (FLUX via fal.ai) cobrando créditos específicos configurados no banco de dados.
* **RF-008**: O sistema deve disponibilizar gerador de imagem para vídeo (Kling via fal.ai).
* **RF-009**: O sistema deve implementar a funcionalidade de *Motion Control* (Kling Motion Control via fal.ai) aceitando imagem de personagem e vídeo de referência.
* **RF-010**: O sistema deve suportar integração com Lip Sync (Sync via fal.ai) utilizando entrada de áudio e vídeo/imagem.
* **RF-011**: O sistema deve permitir o Upscale de vídeos gerados.
* **RF-012**: O usuário deve conseguir visualizar o histórico de suas gerações, efetuar download e reproduzir mídias diretamente pelo navegador.

### 1.3 Sistema Financeiro e Créditos
* **RF-013**: O usuário deve poder selecionar pacotes de créditos e prosseguir para o checkout VorexPay.
* **RF-014**: O sistema deve receber confirmações de pagamento via webhooks seguros e liberar os créditos de forma idempotente e transacional.
* **RF-015**: O administrador deve conseguir debitar, creditar ou atribuir saldo ilimitado para qualquer usuário via painel admin.

### 1.4 Painel Administrativo
* **RF-016**: O administrador deve poder gerenciar usuários (bloquear, visualizar logs de auditoria, gerenciar créditos).
* **RF-017**: O administrador deve conseguir alterar dinamicamente o custo de créditos de cada ferramenta de IA.
* **RF-018**: O administrador deve ter acesso a métricas de conversão de pagamentos e logs de erros de integrações de IA.

---

## 2. Requisitos Não Funcionais (RNF)

* **RNF-001 (Segurança)**: As senhas devem ser criptografadas usando hash seguro (ex: bcrypt ou argon2).
* **RNF-002 (Performance/Assincronismo)**: Toda integração com provedores de IA deve ser tratada como Job Assíncrono com webhooks. O frontend não deve prender a requisição HTTP.
* **RNF-003 (Persistência)**: Vídeos e imagens gerados não devem ser salvos diretamente no banco de dados. O sistema deve utilizar armazenamento compatível com S3 e guardar somente as URLs/keys.
* **RNF-004 (Design)**: O frontend deve ser construído utilizando Tailwind CSS e shadcn/ui seguindo a identidade provisória (Vermelho, Preto/Grafite e Branco).
* **RNF-005 (Responsividade)**: A interface deve ser 100% amigável para dispositivos móveis (Mobile-First).

---

## 3. Regras de Negócio (RN)

* **RN-001 (Proteção de Saldo)**: O débito de créditos deve ser verificado e executado no backend de forma transacional (`prisma.$transaction`) antes do envio do job à API externa da fal.ai.
* **RN-002 (Tratamento de Falhas)**: Se um job de IA falhar de forma definitiva, o backend deve estornar os créditos equivalentes ao saldo do usuário de forma automática.
* **RN-003 (Prevenção de Fraudes)**: Webhooks de pagamento duplicados ou falsificados não podem em hipótese alguma gerar créditos adicionais. O sistema deve validar a assinatura do webhook e persistir a transação de forma única.
* **RN-004 (Créditos Ilimitados)**: Usuários marcados com `isUnlimited = true` no backend não sofrem débito de saldo, mas a geração de jobs continua registrando o custo estimado da API para fins de auditoria financeira.
