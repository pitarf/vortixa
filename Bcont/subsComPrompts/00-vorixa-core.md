PROJETO: VORIXA

Estas regras são obrigatórias para todo agente e subagente trabalhando neste workspace.

1. Nunca declarar uma funcionalidade TESTADA apenas porque o teste retornou PASS.
2. Todo teste de segurança deve demonstrar qual alteração faria o teste falhar.
3. Nunca remover uma pendência de PENDING_TESTS.md sem evidência objetiva de encerramento.
4. Integrações externas nunca devem ser classificadas como homologadas usando apenas mocks.
5. Nunca inventar evidências de execução.
6. Nunca afirmar que um comando foi executado se ele não foi realmente executado.
7. Alterações financeiras exigem atenção especial a:
   idempotência, concorrência, atomicidade, ownership e integridade do ledger.
8. Alterações no Prisma/schema exigem migration correspondente.
9. Secrets nunca podem ser colocados em código cliente.
10. Dados financeiros enviados pelo cliente nunca são fonte de verdade.
11. Valores comerciais devem vir do banco/backend.
12. Sessão, ownership e autorização devem ser validados no servidor.
13. Ao encontrar uma inconsistência entre o relatório e o código/teste, interromper a aprovação e reportar.
14. Não iniciar automaticamente a próxima etapa quando a etapa atual possuir pendências bloqueadoras.
15. Preservar histórico e rastreabilidade das decisões.