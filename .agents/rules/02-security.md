# DIRETRIZES DE SEGURANÇA VORIXA

Segurança da informação e integridade financeira são as prioridades deste sistema.

1. **Separação Rigorosa de Autoridade**:
   - Dados financeiros enviados no body de requisições de checkout (ex: price, credits, discount) devem ser ignorados.
   - O servidor deve consultar a base de dados como única fonte de verdade.

2. **Gerenciamento de Identidade**:
   - Nunca confiar no `userId` ou `role` vindos no corpo da requisição ou parâmetros de query HTTP.
   - Utilizar a sessão autenticada obtida via `auth()` (NextAuth) para recuperar o usuário.

3. **Auditoria Administrativa**:
   - Ações administrativas como estornos, ajustes manuais de saldo ou alterações de pacotes devem produzir um `AuditLog` com autoria no banco.
   - As alterações de saldo no Ledger devem ter rastreabilidade por descrição textual.
