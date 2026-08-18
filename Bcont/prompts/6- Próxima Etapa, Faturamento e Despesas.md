Agora que Obrigações e a estrutura de vencimentos foram corrigidas e validadas, vamos avançar para os módulos de FATURAMENTO e DESPESAS.

Não faça uma reformulação visual geral.

Quero funcionalidades reais conectadas ao banco e relacionadas às empresas.

## 1. FATURAMENTO

Implementar o módulo de faturamento por empresa e competência.

Cada registro deve permitir:

- Empresa
- Competência
- Tipo de documento/origem
- Valor do faturamento
- Documento anexado
- Data de inclusão
- Usuário responsável
- Observações

Preparar o sistema para receber posteriormente documentos como:

- PDFs de faturamento
- Declarações de faturamento
- Relatórios de empresas do Simples

## 2. HISTÓRICO DE FATURAMENTO

Criar uma visão histórica por empresa.

Permitir visualizar:

- Faturamento mensal
- Faturamento anual
- Comparação com mês anterior
- Comparação com mesmo período do ano anterior
- Variação percentual

Quando não houver dados suficientes para comparação, informar isso claramente.

Não inventar valores.

## 3. UPLOAD DE DOCUMENTOS

Permitir anexar documentos relacionados ao faturamento.

Utilizar o storage privado já existente.

Registrar:

- Arquivo
- Empresa
- Competência
- Usuário
- Data do upload

Respeitar as regras de acesso existentes.

## 4. PREPARAÇÃO PARA LEITURA DE PDF

Preparar a arquitetura para futuramente utilizar IA para:

- Ler declarações
- Identificar faturamento
- Extrair competência
- Identificar período
- Alimentar automaticamente os registros

Não implementar IA simulada.

Se a integração ainda não estiver disponível, deixar a estrutura preparada.

## 5. DESPESAS

Implementar o módulo de despesas por empresa.

Cada despesa deve possuir:

- Empresa
- Competência
- Data
- Descrição
- Fornecedor
- Categoria
- Valor
- Tipo
- Recorrente
- Fixa
- Documento
- Observações

Permitir:

- Criar
- Editar
- Excluir
- Pesquisar
- Filtrar
- Visualizar

## 6. DESPESAS RECORRENTES

Criar estrutura para identificar despesas recorrentes.

O usuário deve conseguir marcar uma despesa como:

- Fixa
- Recorrente
- Não recorrente

Permitir acompanhar a ocorrência ao longo dos meses.

Exemplos citados pela cliente:

- Telefone
- Celpe
- Compensa

Não criar regras específicas para esses fornecedores.

## 7. DESPESAS AUSENTES

Criar estrutura para identificar quando uma despesa considerada fixa/recorrente não apareceu em determinado mês.

Exemplo:

Telefone:
Janeiro: presente
Fevereiro: presente
Março: presente
Abril: ausente

O sistema deve sinalizar:

"Despesa recorrente não identificada neste período."

Não considerar automaticamente que a despesa não existe. Apenas sinalizar para conferência.

## 8. RELATÓRIO DE DESPESAS

Criar relatório por empresa com:

- Total de despesas
- Evolução mensal
- Despesas por categoria
- Despesas por fornecedor
- Despesas recorrentes
- Despesas fixas
- Despesas ausentes
- Comparação com períodos anteriores

Criar gráficos quando houver dados suficientes.

## 9. RELAÇÃO COM FATURAMENTO

Preparar os dados para posteriormente calcular:

- Despesa / faturamento
- Representatividade percentual
- Evolução da relação entre faturamento e despesas

Não implementar ainda regras contábeis complexas de classificação.

## 10. DASHBOARD

Atualizar o Dashboard futuramente para utilizar os dados reais desses módulos.

Não adicionar indicadores fictícios.

## 11. PREPARAÇÃO PARA O PAINEL CONTÁBIL

A estrutura de faturamento e despesas deve ser criada pensando na futura integração com:

- Extratos bancários
- Notas fiscais
- Planilhas financeiras
- Conciliação
- DRE

Os relacionamentos devem ser organizados para que esses módulos possam utilizar os mesmos dados posteriormente.

## 12. TESTES

Testar de ponta a ponta:

- Criar faturamento
- Editar faturamento
- Excluir faturamento
- Filtrar por empresa
- Filtrar por competência
- Criar despesa
- Editar despesa
- Excluir despesa
- Marcar despesa como fixa
- Marcar despesa como recorrente
- Identificar ausência de despesa recorrente
- Upload de documentos
- Permissões
- RLS
- Responsividade
- Console
- TypeScript
- Lint

Não considerar as funcionalidades concluídas apenas porque a interface existe.

Quero os dados realmente persistidos no banco e utilizados pelos relatórios.

Ao finalizar, informe:

- O que foi implementado
- O que foi testado
- O que está funcionando de ponta a ponta
- O que ainda depende de IA
- O que será necessário para iniciar o Painel Contábil