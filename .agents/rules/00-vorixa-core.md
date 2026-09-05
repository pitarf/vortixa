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
16. **MANUAL DO DESENVOLVEDOR (docs/MANUAL_DEV.md) e MANUAL DO USUÁRIO (docs/MANUAL_USER.md) são documentos vivos e cumulativos**:
    - Cada nova funcionalidade, alteração, correção, decisão arquitetural, fluxo ou comportamento relevante DEVE acrescentar informações aos manuais existentes.
    - É TERMINANTEMENTE PROIBIDO apagar, truncar ou substituir o conteúdo anterior por um resumo raso do estado atual. O agente deve ler o manual existente e acrescentar/atualizar pontualmente as seções pertinentes.
17. **Estrutura Obrigatória do MANUAL_USER.md**:
    - Conforme cada tela/funcionalidade for concluída, acrescentar: Módulo -> Tela -> Objetivo -> Como acessar -> Campos -> Botões -> Filtros -> Passo a passo -> Resultados esperados -> Mensagens/alertas -> Erros comuns -> Exemplos práticos.
18. **Estrutura Obrigatória do MANUAL_DEV.md**:
    - Cada implementação deve acrescentar: Arquitetura -> Banco -> Migration -> RLS/Auth -> Server Functions/APIs -> IA/Gateways -> Fluxo de dados -> Componentes -> Regras de negócio -> Testes -> Integrações -> Segurança -> Variáveis de ambiente -> Decisões técnicas -> Troubleshooting.
19. **Critério de Conclusão (Definition of Done)**:
    - Nenhuma implementação ou fase pode ser considerada concluída sem que a documentação correspondente (`docs/MANUAL_DEV.md`, `docs/MANUAL_USER.md`, `documents/task.md` e `docs/CHANGELOG.md`) tenha sido cumulativamente atualizada.
