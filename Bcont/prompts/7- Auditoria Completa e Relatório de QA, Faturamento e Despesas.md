Não quero implementar novas funcionalidades nesta etapa.

Quero uma AUDITORIA COMPLETA e um RELATÓRIO DE QA detalhado dos módulos de FATURAMENTO e DESPESAS que você acabou de informar como "completos".

Não considere uma funcionalidade concluída apenas porque a interface, tabela ou função existe.

Quero que você realmente execute os fluxos no navegador e, quando possível, valide também diretamente pelas APIs/banco.

Para cada funcionalidade, informe exatamente:

- O que foi testado
- Como foi testado
- Resultado esperado
- Resultado obtido
- Status: PASSOU / FALHOU / PARCIAL / NÃO TESTADO
- Evidência do teste
- Se houve correção, qual foi a correção realizada

NÃO faça apenas um resumo dizendo que está funcionando.

# 1. FATURAMENTO

Testar individualmente:

### Cadastro
- Criar registro de faturamento
- Selecionar empresa
- Informar competência
- Informar valor
- Informar origem/tipo de documento
- Adicionar observação
- Salvar

Confirmar que o registro realmente foi persistido no banco.

### Edição
- Editar um faturamento existente
- Alterar valor
- Alterar competência
- Salvar
- Recarregar a página
- Confirmar que a alteração permaneceu

### Exclusão
- Excluir um registro
- Confirmar que desapareceu da interface
- Confirmar que não continua sendo retornado pela consulta

### Filtros
Testar:
- Empresa
- Competência
- Período
- Pesquisa

Confirmar que os resultados realmente mudam de acordo com o filtro.

### Histórico
Criar registros de pelo menos dois períodos e confirmar:

- Comparação mensal
- Comparação anual
- Variação percentual

Não usar valores fictícios apresentados como dados reais.

### Documentos
Testar:

1. Upload de documento
2. Associação com empresa
3. Associação com faturamento
4. Persistência no storage
5. Download autorizado
6. Tentativa de acesso não autorizado
7. Exclusão

Confirmar que o bucket continua privado.

### Auditoria
Confirmar que o sistema registra:

- Usuário que lançou
- Data
- Registro alterado

# 2. DESPESAS

Testar individualmente:

### Cadastro
Criar despesa contendo:

- Empresa
- Competência
- Data
- Descrição
- Fornecedor
- Categoria
- Valor
- Tipo
- Fixa
- Recorrente
- Observação

Confirmar persistência real no banco.

### Edição
Alterar dados e confirmar persistência após recarregar.

### Exclusão
Excluir e confirmar remoção real.

### Filtros
Testar:

- Empresa
- Competência
- Categoria
- Fornecedor
- Tipo
- Fixa
- Recorrente

Confirmar resultados.

# 3. DESPESAS RECORRENTES

Criar uma despesa recorrente de teste.

Criar registros para meses diferentes.

Confirmar que o sistema consegue identificar a recorrência.

Depois deixar um mês sem registro.

Confirmar que o sistema sinaliza:

"Despesa recorrente não identificada neste período."

IMPORTANTE:

Não criar automaticamente um valor para o mês ausente.

Apenas sinalizar a ausência.

# 4. RELATÓRIO DE DESPESAS

Validar com dados reais de teste criados durante a auditoria.

Confirmar:

- Total de despesas
- Despesas por categoria
- Despesas por fornecedor
- Evolução mensal
- Despesas recorrentes
- Despesas fixas
- Despesas ausentes
- Comparação entre períodos

Confirmar matematicamente se os valores apresentados no relatório correspondem aos registros existentes no banco.

# 5. RELAÇÃO DESPESA X FATURAMENTO

Criar dados controlados de teste.

Exemplo:

Faturamento:
R$ 10.000

Despesas:
R$ 2.500

O sistema deve apresentar corretamente a relação de 25%.

Depois alterar o faturamento e confirmar que o indicador é recalculado.

IMPORTANTE:

Não considerar esse exemplo como dado real. É apenas um teste controlado.

# 6. ANEXOS

Testar arquivos reais de teste.

Validar:

- Upload
- Persistência
- Associação
- Download
- Exclusão
- Permissões
- RLS

Testar também tentativa de acesso ao arquivo por usuário que não deveria ter permissão.

# 7. PERMISSÕES

Testar com:

### Administrador
Deve conseguir visualizar e administrar conforme as permissões definidas.

### Usuário comum
Deve respeitar as restrições de acesso.

Confirmar que esconder botões na interface não é a única proteção.

Testar a API/backend.

# 8. DASHBOARD

Confirmar que os indicadores relacionados a faturamento e despesas, se existentes, são derivados dos dados reais.

Não aceitar números mockados.

# 9. IA

Você informou que os contratos de IA estão preparados.

Quero que diferencie claramente:

### IMPLEMENTADO
Funciona de verdade neste momento.

### PREPARADO
Existe estrutura/código/interface para receber a funcionalidade.

### NÃO IMPLEMENTADO
Ainda não existe processamento real.

Não considere "contrato de IA pronto" como leitura de documento implementada.

# 10. BANCO DE DADOS

Verificar as tabelas relacionadas a:

- Faturamento
- Despesas
- Documentos
- Empresas
- Usuários

Confirmar:

- Relacionamentos
- Foreign keys
- Índices
- RLS
- Políticas de acesso
- Integridade dos dados

# 11. TESTE DE PERSISTÊNCIA

Para pelo menos um registro de faturamento e uma despesa:

1. Criar
2. Salvar
3. Sair da página
4. Reabrir
5. Pesquisar
6. Editar
7. Recarregar
8. Confirmar persistência

# 12. TESTE DE REGRESSÃO

Depois dos testes, verificar se as alterações não quebraram:

- Login
- Dashboard
- Empresas
- Tarefas
- Obrigações
- Certidões
- Folha
- Legalização
- Documentos
- Usuários
- Setores
- Configurações

Verificar também:

- Rotas
- Console
- TypeScript
- ESLint
- Responsividade

# 13. RELATÓRIO FINAL OBRIGATÓRIO

No final, NÃO responda apenas "Faturamento e Despesas estão completos".

Gere um relatório estruturado exatamente com:

## RESUMO EXECUTIVO

Percentual estimado de conclusão dos módulos.

## FATURAMENTO

Tabela:

| Funcionalidade | Teste realizado | Resultado | Status |
|---|---|---|---|

## DESPESAS

Mesma estrutura.

## DOCUMENTOS E STORAGE

Mesma estrutura.

## RELATÓRIOS

Mesma estrutura.

## PERMISSÕES E SEGURANÇA

Mesma estrutura.

## IA

Separar:

- Implementado
- Preparado
- Não implementado

## BANCO DE DADOS

Informar tabelas, relacionamentos e RLS verificadas.

## TESTES EXECUTADOS

Informar quantidade de testes:

- Executados
- Passaram
- Falharam
- Parciais
- Não testados

## BUGS ENCONTRADOS

Para cada bug:

- Descrição
- Gravidade
- Correção realizada
- Status

## PENDÊNCIAS REAIS

Listar tudo que ainda precisa ser desenvolvido.

## CONCLUSÃO

Responder claramente:

1. O módulo está realmente funcional?
2. Quais partes são apenas estrutura?
3. O que falta para considerar o módulo pronto para uso?
4. Qual é a próxima etapa recomendada?

IMPORTANTE:

Se algum teste não puder ser realizado, escreva "NÃO TESTADO" e explique o motivo.

Não marque como PASSOU algo que não foi efetivamente testado.

Não invente resultados de testes.

Não crie dados fictícios e apresente-os como dados reais.

Se encontrar problemas durante a auditoria, corrija os problemas seguros de corrigir e execute novamente o teste afetado.

Ao final, apresente o relatório completo.