A auditoria foi concluída e os problemas críticos de segurança e estrutura foram corrigidos.

Agora vamos iniciar a implementação funcional dos módulos.

NÃO faça uma reformulação visual geral neste momento.

Priorize funcionalidades reais, banco de dados, CRUDs, relacionamentos, permissões e fluxos de negócio.

## 1. Usuários e permissões

Implementar completamente a área Administração > Usuários.

O administrador deve conseguir:

- Visualizar usuários
- Visualizar nome, e-mail, status, setor e papel
- Ativar usuário
- Desativar usuário
- Promover usuário para administrador
- Rebaixar administrador para usuário comum
- Associar usuário a setor

Todas essas ações devem respeitar as RLS e regras de segurança já implementadas.

A alteração de papel nunca deve depender apenas da interface. O backend deve validar a permissão.

## 2. Setores

Implementar CRUD completo de setores:

- Criar
- Editar
- Ativar/desativar
- Listar
- Pesquisar

Preparar os setores para serem utilizados em:

- Usuários
- Tarefas
- Obrigações
- Produtividade

## 3. Empresas

Deixar o módulo Empresas completamente funcional.

Campos:

- Razão social
- Nome fantasia
- CNPJ
- Regime tributário
- Atividade
- Segmento
- Município
- Estado
- Situação
- Setor responsável
- Responsável
- Possui folha
- Observações

Implementar:

- Cadastro
- Edição
- Exclusão
- Visualização
- Pesquisa
- Filtros
- Página de detalhes da empresa

A página de detalhes deve funcionar como o centro da empresa, permitindo futuramente acessar:

- Tarefas
- Obrigações
- Certidões
- Folha
- Legalização
- Documentos
- Faturamento
- Despesas
- Contabilidade
- Relatórios

## 4. Tarefas

Implementar o Gerenciador de Tarefas funcional.

Cada tarefa deve possuir:

- Título
- Descrição
- Empresa
- Responsável
- Setor
- Prioridade
- Status
- Data de criação
- Prazo
- Data de conclusão
- Observações
- Anexos

Implementar:

- Criar
- Editar
- Concluir
- Reabrir
- Excluir
- Filtrar
- Pesquisar
- Ordenar

Usuários comuns devem visualizar somente as tarefas permitidas pelas regras de acesso.

Administradores podem visualizar tudo.

## 5. Obrigações

Transformar o módulo de obrigações em funcional.

Criar estrutura configurável para regras baseadas em:

- Regime tributário
- Atividade
- Município
- Existência de folha

O administrador deve conseguir cadastrar e editar regras.

Não inventar regras tributárias além das informações fornecidas pela cliente.

A estrutura deve permitir posteriormente adicionar novas regras sem alteração estrutural do sistema.

## 6. Certidões

Implementar o fluxo de cadastro e armazenamento.

Permitir:

- Selecionar empresa
- Selecionar tipo de certidão
- Upload de PDF
- Data de emissão
- Data de validade
- Status
- Observações
- Histórico

Preparar o processamento por IA, mas não fingir que a leitura automática está funcionando se ainda não houver integração.

## 7. Legalização

Implementar:

- Criar processo
- Selecionar empresa
- Tipo de processo
- Responsável
- Status
- Data
- Prazo
- Observações
- Documentos

Permitir criar etapas personalizadas e acompanhar o andamento.

## 8. Folha

Implementar o cadastro das informações trimestrais:

- Empresa
- Período
- Funcionários atuais
- Admissões
- Rescisões
- Observações

Preparar os dados para posteriormente serem utilizados nos relatórios e DRE.

## 9. Documentos

Implementar o gerenciamento real dos documentos.

Permitir:

- Upload
- Download
- Visualização
- Exclusão
- Associação com empresa
- Associação com módulo
- Pesquisa
- Filtros

Manter o bucket privado e respeitar as políticas de acesso já implementadas.

## 10. Dashboard

Depois que os módulos acima estiverem funcionais, revisar o Dashboard.

Todos os indicadores devem vir dos dados reais do banco.

Exibir:

- Tarefas pendentes
- Tarefas atrasadas
- Tarefas concluídas
- Empresas
- Obrigações próximas
- Certidões com pendência
- Legalizações em andamento
- Atividades do período

Não utilizar números fictícios.

## 11. Fluxo de primeiro usuário

ATENÇÃO:

A regra atual de transformar automaticamente o primeiro cadastro em administrador deve ser considerada temporária para desenvolvimento.

Não remover ainda sem criar uma alternativa segura.

Preparar uma solução para produção em que um usuário comum não possa simplesmente criar uma conta e obter privilégios administrativos.

## 12. Testes

Depois da implementação:

- Testar CRUDs
- Testar permissões
- Testar RLS
- Testar upload
- Testar rotas
- Testar desktop
- Testar mobile
- Verificar console
- Verificar erros de API
- Verificar TypeScript
- Verificar ESLint

Não avance para o próximo módulo se houver erro crítico nos módulos anteriores.

## 13. Regra de desenvolvimento

Não criar apenas interfaces simuladas.

Quando uma funcionalidade for marcada como implementada, ela deve estar conectada ao banco e funcionar de ponta a ponta.

Quando uma funcionalidade ainda depender de integração externa ou IA, deixar claramente identificada como pendente e manter a arquitetura preparada.

Ao final, apresente:

- Funcionalidades implementadas
- Funcionalidades ainda pendentes
- Problemas encontrados
- Testes realizados
- Próxima etapa recomendada