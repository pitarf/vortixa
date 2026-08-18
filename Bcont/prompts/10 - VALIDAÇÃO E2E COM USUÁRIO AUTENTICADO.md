ÚLTIMA ETAPA DE QA: VALIDAÇÃO E2E COM USUÁRIO AUTENTICADO

A auditoria de regressão das regras de negócio foi concluída com 28 testes passando.

Porém, o relatório informou que os testes de navegador com sessão autenticada ficaram indisponíveis porque o ambiente estava signed_out.

Antes de considerar o sistema inteiro aprovado, quero resolver especificamente essa lacuna.

NÃO desenvolver novas funcionalidades.

NÃO alterar regras de negócio.

NÃO alterar a arquitetura existente.

Quero apenas validar os fluxos reais pelo navegador com um usuário autenticado.

==================================================
1. USUÁRIO DE QA
==================================================

Utilize uma conta de teste existente ou crie uma conta temporária de QA exclusivamente para esta validação.

Se criar uma conta, identificar claramente que é uma conta de teste.

Garantir que ela tenha o papel necessário para executar os testes administrativos e, quando possível, criar também um usuário comum para testar permissões.

==================================================
2. TESTE E2E ADMINISTRADOR
==================================================

Com sessão autenticada de administrador, testar pelo navegador:

- Login
- Dashboard
- Empresas
- Tarefas
- Obrigações
- Certidões
- Legalização
- Documentos
- Faturamento
- Despesas
- Painel Contábil
- Importação
- Notas fiscais
- Plano de contas
- Conciliação
- Exportação
- DRE
- Relatórios
- Usuários
- Setores
- Configurações

Não basta abrir as páginas.

Executar pelo menos uma operação real de leitura e, quando seguro, uma operação de criação/edição.

==================================================
3. TESTE DE INTEGRAÇÃO

Executar um fluxo completo:

Empresa
→ Faturamento
→ Despesa
→ Plano de contas
→ DRE
→ Relatório

E outro:

Empresa
→ OFX
→ Transação
→ Nota
→ Sugestão de conciliação
→ Confirmação
→ Conta contábil
→ DRE

E outro:

Empresa
→ Obrigação
→ Vencimento
→ Tarefa
→ Conclusão
→ Dashboard

==================================================
4. TESTE DE STORAGE

Com usuário autenticado:

- Upload de documento
- Visualização do registro
- Download autorizado

Depois testar que o arquivo não está disponível publicamente.

==================================================
5. TESTE DE PERMISSÕES

Criar/utilizar um usuário comum.

Testar pelo navegador:

- Acesso a áreas permitidas
- Acesso a áreas administrativas
- Tentativa de acessar URL administrativa diretamente
- Tentativa de excluir registro
- Tentativa de alterar papel
- Tentativa de acessar dados que não deveria visualizar

Confirmar o comportamento real no backend/RLS.

==================================================
6. TESTE MOBILE

Validar pelo menos as telas principais em 390px:

- Dashboard
- Empresas
- Tarefas
- Obrigações
- Certidões
- Faturamento
- Despesas
- Painel Contábil
- Conciliação
- DRE
- Relatórios

Verificar especialmente:

- Tabelas
- Formulários
- Modais
- Filtros
- Gráficos
- Menu
- Botões
- Navegação

Não basta a página caber na tela. Confirmar que é realmente utilizável.

==================================================
7. TESTE DE REGRESSÃO VISUAL/FUNCIONAL

Depois de todos os testes, recarregar as páginas e confirmar:

- Sessão permanece ativa
- Dados continuam persistidos
- Filtros continuam funcionando
- Dashboard continua consistente
- DRE continua consistente
- Relatórios continuam consistentes
- Nenhum erro aparece no console

==================================================
8. DADOS DE TESTE

Utilizar dados temporários.

Ao finalizar, remover:

- Empresas de QA
- Faturamentos de QA
- Despesas de QA
- Transações de QA
- Notas de QA
- Documentos de QA
- Obrigações de QA
- Contas contábeis de QA

Não deixar dados fictícios misturados aos dados reais.

==================================================
9. RELATÓRIO FINAL

Quero um relatório específico desta etapa.

Informar:

### Testes E2E
Quantidade executada:
Passaram:
Falharam:
Parciais:
Não testados:

### Fluxos completos
Listar cada fluxo e seu resultado.

### Autenticação
Resultado.

### Permissões/RLS
Resultado.

### Storage
Resultado.

### Mobile
Resultado.

### Console/API
Resultado.

### Problemas encontrados
Para cada problema:

- Descrição
- Gravidade
- Correção
- Reteste

### Pendências

Listar tudo que ainda não foi comprovado.

### CONCLUSÃO

Responder objetivamente:

1. Os testes de lógica estão aprovados?
2. Os testes E2E autenticados estão aprovados?
3. As permissões foram comprovadas em execução real?
4. O mobile foi comprovado?
5. O sistema inteiro pode ser considerado aprovado para iniciar a camada de IA?

IMPORTANTE:

Não marque como PASSOU algo que não foi realmente executado.

Se alguma etapa continuar impossibilitada por limitação do ambiente, marque como NÃO TESTADO e explique exatamente o motivo.

Não desenvolver novas funcionalidades nesta etapa.