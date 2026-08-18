AUDITORIA GERAL DE REGRESSÃO DO SISTEMA

Não implemente novas funcionalidades nesta etapa.

Quero uma auditoria completa de regressão de TODO o sistema atual.

O objetivo é verificar se todas as funcionalidades anteriormente implementadas e aprovadas continuam funcionando depois das últimas alterações.

NÃO considere uma funcionalidade aprovada apenas porque a tela abre.

Execute os fluxos reais no navegador e valide persistência, backend/RLS, navegação e integrações entre módulos.

==================================================
1. AUTENTICAÇÃO E SESSÃO
==================================================

Testar:

- Cadastro
- Login
- Logout
- Sessão persistente
- Reload
- Nova aba
- Recuperação de senha
- Acesso sem sessão
- Redirecionamento para /auth
- Rotas privadas
- Rotas inexistentes

Confirmar que não existem 404 inesperados ou erros de console.

==================================================
2. ADMINISTRAÇÃO
==================================================

Testar com administrador:

- Usuários
- Ativação/desativação
- Papéis
- Setores
- Configurações
- Regras de obrigações
- Auditoria

Testar com usuário comum:

- Acesso permitido
- Acesso proibido
- Tentativa de acesso direto por URL
- Tentativa de alteração via backend/API

Confirmar RLS.

==================================================
3. EMPRESAS
==================================================

Testar:

- Criar empresa
- Editar
- Excluir
- Pesquisar
- Filtros
- Abrir detalhes
- Abas da empresa

Confirmar que os módulos vinculados continuam funcionando:

- Tarefas
- Obrigações
- Certidões
- Folha
- Legalização
- Documentos
- Faturamento
- Despesas
- Contabilidade

==================================================
4. TAREFAS
==================================================

Testar:

- Criar
- Editar
- Concluir
- Reabrir
- Excluir
- Responsável
- Setor
- Filtros
- Relação com empresa

Confirmar persistência após reload.

==================================================
5. OBRIGAÇÕES
==================================================

Testar:

- Cadastro
- Geração por regra
- Geração em lote
- Competência
- Periodicidade
- Responsável
- Setor
- Vencimento
- Conclusão
- Reabertura
- Filtros
- Dashboard
- Próximos vencimentos

Testar também:

- Dia fixo
- Último dia do mês
- Competência
- N meses depois
- Regra sem vencimento

Confirmar que o sistema NUNCA inventa uma data quando não existe regra.

==================================================
6. CERTIDÕES
==================================================

Testar:

- Cadastro
- Empresa
- Tipo
- Upload
- Data de emissão
- Data de validade
- Status
- Pendências
- Regularização
- Histórico
- Download
- Exclusão
- Permissões

Confirmar storage privado e URLs assinadas.

==================================================
7. LEGALIZAÇÃO
==================================================

Testar:

- Criar processo
- Empresa
- Responsável
- Status
- Etapas
- Conclusão
- Reabertura
- Documentos
- Exclusão

==================================================
8. DOCUMENTOS E STORAGE
==================================================

Testar:

- Upload
- Download autorizado
- Exclusão
- Associação com empresa
- Associação com módulo
- Usuário sem permissão
- Acesso anônimo

Confirmar que arquivos privados não ficam acessíveis publicamente.

==================================================
9. FATURAMENTO
==================================================

Testar:

- Criar
- Editar
- Excluir
- Persistência
- Empresa
- Competência
- Documento
- Anexo
- Filtros
- Histórico
- Comparação mensal
- Comparação anual

Validar cálculos.

==================================================
10. DESPESAS
==================================================

Testar:

- Criar
- Editar
- Excluir
- Empresa
- Categoria
- Fornecedor
- Tipo
- Fixa
- Recorrente
- Eventual
- Filtros

Testar recorrências ausentes.

Confirmar que o sistema apenas sinaliza ausência e NÃO cria valores automaticamente.

==================================================
11. PAINEL CONTÁBIL
==================================================

Testar:

- Painel
- Histórico de importações
- OFX
- PDF
- Planilhas
- XLSX
- XLS
- CSV
- Notas fiscais
- Parcelas
- Plano de contas
- Conciliação
- Exportação

==================================================
12. OFX
==================================================

Executar uma importação real de teste.

Validar:

- Banco
- Conta
- Período
- Transações
- Entrada/saída
- Identificadores
- Fingerprint
- Deduplicação
- Reimportação

Confirmar que importar o mesmo arquivo novamente não duplica transações.

==================================================
13. CONCILIAÇÃO
==================================================

Testar:

- Transação não conciliada
- Geração de sugestão
- Valor exato
- Diferença de centavos
- Juros/multa
- Parcelamento
- Confiança
- Motivo da sugestão
- Confirmar
- Rejeitar
- Ignorar
- Histórico da decisão
- Conta contábil

IMPORTANTE:

Confirmar que uma sugestão NUNCA vira conciliação automaticamente.

A confirmação humana deve continuar obrigatória.

==================================================
14. PLANO DE CONTAS
==================================================

Testar:

- Criar conta
- Editar
- Ativar/desativar
- Conta geral
- Conta por empresa
- Associação com lançamento
- Classificação utilizada pela DRE

==================================================
15. EXPORTAÇÃO CONTÁBIL
==================================================

Testar:

- Configuração de layout
- Permissões
- Prévia
- CSV
- TXT
- Separador
- Decimal
- Data
- Histórico de exportações

Confirmar que os dados exportados correspondem aos dados da tela.

==================================================
16. DRE
==================================================

Testar novamente:

- Sem dados
- Apenas receitas
- Apenas despesas
- Receita + despesas
- Lançamento conciliado
- Lançamento não conciliado
- Lançamento sem classificação
- Receita líquida
- Resultado
- Margem
- Comparação mensal
- Comparação anual

Validar matematicamente os resultados.

==================================================
17. RELATÓRIOS
==================================================

Testar:

- Financeiro
- Despesas
- Faturamento
- Contábil
- Filtros
- Gráficos
- Exportação CSV

Confirmar que os números correspondem ao banco.

==================================================
18. INTEGRAÇÃO ENTRE MÓDULOS
==================================================

Esta é uma das partes MAIS IMPORTANTES da auditoria.

Testar os fluxos completos:

FLUXO A:

Empresa
→ Obrigação
→ Tarefa
→ Conclusão
→ Dashboard

FLUXO B:

Empresa
→ Certidão
→ Documento
→ Pendência
→ Regularização

FLUXO C:

Empresa
→ Faturamento
→ Despesa
→ Relatório financeiro
→ DRE

FLUXO D:

Empresa
→ OFX
→ Transação
→ Nota fiscal
→ Sugestão
→ Confirmação
→ Conta contábil
→ DRE

FLUXO E:

Empresa
→ Faturamento
→ Despesas
→ Relação despesa/faturamento
→ Relatório

Confirmar que os dados continuam relacionados corretamente entre os módulos.

==================================================
19. DASHBOARD
==================================================

Confirmar que todos os indicadores existentes vêm do banco.

Verificar:

- Empresas
- Tarefas
- Obrigações
- Certidões
- Legalização
- Financeiro
- Outros indicadores existentes

Não aceitar números mockados.

==================================================
20. SEGURANÇA
==================================================

Testar:

- RLS
- Admin
- Usuário comum
- Acesso anônimo
- Rotas privadas
- API
- Storage
- Papéis
- user_roles
- Perfis
- Exclusões

Confirmar que esconder botão na interface NÃO é a única proteção.

==================================================
21. RESPONSIVIDADE
==================================================

Testar:

- Desktop
- Tablet
- Mobile 390px

Verificar:

- Menu
- Tabelas
- Modais
- Formulários
- Gráficos
- Filtros
- Navegação

==================================================
22. QUALIDADE TÉCNICA
==================================================

Executar:

- TypeScript
- ESLint
- Build
- Rotas
- Console
- Erros de API
- Erros de banco

Informar qualquer warning relevante.

Não considerar SECURITY DEFINER intencional como bug, mas documentar.

==================================================
23. DADOS DE TESTE
==================================================

Criar dados temporários somente quando necessários.

Ao finalizar:

- Remover empresas de QA
- Remover faturamentos de QA
- Remover despesas de QA
- Remover transações de QA
- Remover notas de QA
- Remover contas contábeis de QA
- Remover documentos de QA
- Remover obrigações de QA

Não deixar dados fictícios nas tabelas funcionais.

Contas de usuário de teste podem permanecer somente se forem necessárias para testes futuros, e devem ser identificadas claramente.

==================================================
24. RELATÓRIO FINAL OBRIGATÓRIO
==================================================

Este relatório precisa ser MUITO mais detalhado que os anteriores.

Não responda apenas "auditoria concluída".

Apresente:

# RESUMO EXECUTIVO

Percentual estimado de funcionamento do sistema.

# MATRIZ GERAL DE TESTES

| Módulo | Funcionalidade | Teste | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|

Status:

PASSOU
FALHOU
PARCIAL
NÃO TESTADO

# TESTES EXECUTADOS

Informar:

- Total
- Passaram
- Falharam
- Parciais
- Não testados

# BUGS ENCONTRADOS

Para cada bug:

- Módulo
- Descrição
- Gravidade
- Causa
- Correção
- Resultado do reteste

# SEGURANÇA

Detalhar testes de:

- RLS
- API
- Storage
- Admin
- Usuário comum
- Anônimo

# INTEGRAÇÕES

Informar quais fluxos completos foram executados e aprovados.

# BANCO

Informar problemas de:

- Foreign keys
- Integridade
- Índices
- RLS
- Relacionamentos

# PERFORMANCE

Informar problemas encontrados em:

- Consultas
- Carregamento
- Renderização
- Grandes listas

# DADOS DE TESTE

Informar o que foi criado e o que foi removido.

# IA

Separar claramente:

IMPLEMENTADO
PREPARADO
NÃO IMPLEMENTADO

# PENDÊNCIAS

Listar TODAS as funcionalidades ainda pendentes.

# CONCLUSÃO

Responder objetivamente:

1. O sistema inteiro está funcional?
2. Quais módulos estão 100% aprovados?
3. Quais estão parciais?
4. Quais possuem bugs?
5. O que precisa ser corrigido antes da entrega?
6. O sistema está pronto para iniciar a implementação da camada de IA?

IMPORTANTE:

Não invente testes.

Não marque PASSOU sem executar.

Se não puder testar alguma coisa, marque NÃO TESTADO.

Se encontrar um bug seguro de corrigir, corrija e execute novamente o teste.

Não desenvolva novas funcionalidades nesta etapa.

O objetivo agora é SOMENTE AUDITAR, CORRIGIR BUGS DE REGRESSÃO E COMPROVAR O ESTADO REAL DO SISTEMA.