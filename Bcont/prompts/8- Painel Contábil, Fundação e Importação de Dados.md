Agora vamos iniciar o desenvolvimento do módulo mais complexo do sistema: PAINEL CONTÁBIL e CONCILIAÇÃO.

Não implemente ainda uma IA que tome decisões contábeis automaticamente.

Primeiro quero construir uma fundação sólida para receber e processar os dados reais.

Toda operação contábil relevante deve permitir revisão e confirmação humana.

# 1. FLUXO INFORMADO PELA CLIENTE

O fluxo atual informado é:

Documentos recebidos:

- Extratos bancários em PDF
- Extratos bancários em OFX
- Notas fiscais
- Planilhas financeiras

Quando existe planilha financeira + extrato:

1. Realiza conciliação
2. Configura as contas contábeis
3. Gera arquivo CSV ou TXT
4. Envia para o sistema contábil

Quando não existe planilha:

1. Utiliza o extrato
2. Configura as contas contábeis
3. Gera arquivo
4. Envia para o sistema contábil

Depois:

- Analisa os razões
- Analisa fornecedores
- Cruza pagamentos com notas fiscais
- Analisa despesas
- Gera relatórios
- Gera DRE

Este fluxo deve orientar a arquitetura.

# 2. PAINEL CONTÁBIL

Criar uma área central por empresa.

O painel deve apresentar:

- Empresa
- Período
- Documentos importados
- Extratos
- Notas fiscais
- Planilhas
- Transações
- Conciliações
- Pendências
- Sugestões
- Contas contábeis
- Exportações

Criar filtros por:

- Empresa
- Competência
- Tipo de documento
- Status

# 3. IMPORTAÇÃO DE OFX

Implementar suporte real para arquivos OFX.

Ao importar um OFX:

- Validar arquivo
- Identificar banco quando disponível
- Identificar conta quando disponível
- Extrair transações
- Data
- Valor
- Tipo
- Descrição/memo
- Identificador quando disponível

Persistir os dados no banco.

Não duplicar transações quando o mesmo arquivo for importado novamente.

Registrar:

- Arquivo
- Usuário
- Data
- Empresa
- Período
- Quantidade de transações
- Status do processamento

# 4. EXTRATO PDF

Criar a estrutura para upload de PDF.

Nesta primeira etapa:

- Armazenar PDF
- Associar à empresa
- Associar à competência
- Registrar usuário
- Registrar data
- Registrar status do processamento

Preparar arquitetura para futura extração dos lançamentos.

Não afirmar que o PDF foi processado se ainda não existir extração real.

# 5. PLANILHAS FINANCEIRAS

Permitir upload de:

- XLSX
- XLS
- CSV

Criar estrutura para posteriormente mapear colunas.

Exemplo:

Data
Descrição
Fornecedor
Documento
Valor
Tipo

Não assumir que todas as planilhas terão exatamente essas colunas.

Criar uma etapa de pré-visualização e mapeamento.

# 6. NOTAS FISCAIS

Criar estrutura para armazenar notas fiscais.

Cada nota deverá poder possuir:

- Empresa
- Fornecedor
- Número do documento
- Data
- Valor
- Competência
- Arquivo
- Status
- Observações

Preparar para futura extração automática.

# 7. TRANSAÇÕES BANCÁRIAS

Criar uma entidade normalizada para transações.

Campos esperados:

- Empresa
- Conta bancária
- Data
- Descrição
- Valor
- Tipo
- Documento
- Origem
- Identificador externo
- Status de conciliação
- Conta contábil
- Observação

Status:

- Não conciliado
- Sugestão disponível
- Conciliado
- Ignorado

# 8. CONFIGURAÇÃO DE CONTAS CONTÁBEIS

Criar estrutura para configurar contas contábeis.

Permitir:

- Código
- Nome
- Tipo
- Categoria
- Ativo/inativo

Permitir associar uma transação a uma conta contábil.

Não inventar plano de contas.

O plano deve ser configurável pelo usuário.

# 9. CONCILIAÇÃO

Criar a estrutura para cruzar:

- Transações bancárias
- Planilhas financeiras
- Notas fiscais

A conciliação deve considerar, quando disponíveis:

- Número do documento
- Data
- Valor
- Fornecedor
- Descrição
- Somatório
- Parcelamento

# 10. DIFERENÇAS

A cliente informou que existem situações em que:

- Existe multa
- Existe juros
- Existe diferença de R$ 0,01
- O pagamento pode ser parcelado

Portanto, NÃO exigir igualdade exata como única regra.

Criar estrutura para calcular:

- Valor original
- Valor encontrado
- Diferença
- Percentual de diferença
- Data
- Fornecedor

# 11. SUGESTÕES DE CONCILIAÇÃO

Criar um motor de sugestões.

O sistema poderá apresentar:

"Possível correspondência"

Com:

- Transação
- Nota
- Fornecedor
- Data
- Valor
- Diferença
- Motivo da sugestão
- Nível de confiança

IMPORTANTE:

Uma sugestão NÃO é uma conciliação.

O usuário deverá:

- Confirmar
- Rejeitar
- Ignorar

Somente após confirmação a conciliação será registrada como concluída.

# 12. PAGAMENTOS PARCELADOS

Preparar estrutura para pagamentos parcelados.

Uma nota poderá ter:

- Valor total
- Número de parcelas
- Parcelas
- Datas previstas

Uma ou mais transações poderão ser relacionadas às parcelas.

Não assumir automaticamente uma correspondência sem confirmação.

# 13. SEM PLANILHA FINANCEIRA

Criar fluxo específico para quando a empresa não possuir planilha.

O sistema deve utilizar:

- Extrato
- Notas
- Fornecedor
- Data
- Valor
- Descrição
- Parcelamento

E apresentar possíveis correspondências.

Não exigir número de documento quando ele não existir no extrato.

# 14. REVISÃO HUMANA

Criar uma área de revisão.

O usuário deve conseguir visualizar:

- Transação
- Possível nota
- Diferença
- Motivo
- Conta contábil sugerida
- Status

E confirmar ou rejeitar.

Registrar:

- Usuário
- Data
- Decisão

# 15. EXPORTAÇÃO

Preparar geração de arquivos:

- CSV
- TXT

A estrutura deve ser configurável porque o formato final dependerá do sistema contábil utilizado pela cliente.

NÃO inventar um layout de importação.

Criar configuração de campos para futuramente mapear:

- Data
- Conta
- Histórico
- Valor
- Débito
- Crédito
- Documento
- Outros campos necessários

# 16. HISTÓRICO

Toda importação deve registrar:

- Arquivo
- Usuário
- Data
- Empresa
- Período
- Resultado
- Quantidade de registros
- Erros

Permitir consultar o histórico.

# 17. DUPLICIDADE

O sistema deve detectar possíveis importações duplicadas.

Não duplicar automaticamente transações.

Se houver dúvida:

"Possível arquivo já importado."

Permitir que o usuário confirme.

# 18. SEGURANÇA

Aplicar RLS em todos os novos dados.

Usuário somente acessa dados permitidos.

Arquivos continuam privados.

Não expor dados financeiros no frontend sem autorização.

# 19. IA

NÃO implementar ainda:

- Decisão contábil automática
- Conciliação automática sem confirmação
- Classificação contábil definitiva
- Alteração automática de registros

A arquitetura deve ficar preparada para IA posteriormente.

Quando a IA for adicionada, ela deverá produzir sugestões e explicações, e não executar decisões críticas sem confirmação.

# 20. TESTES OBRIGATÓRIOS

Criar dados controlados de teste.

Testar:

- Importação OFX
- Importação duplicada
- Upload PDF
- Upload XLSX
- Upload CSV
- Cadastro de nota
- Cadastro de conta contábil
- Associação
- Conciliação
- Sugestão
- Confirmação
- Rejeição
- Diferença de centavos
- Diferença por juros
- Diferença por multa
- Possível parcelamento
- Exportação
- Permissões
- RLS

# 21. RELATÓRIO DE QA

Ao terminar, NÃO diga apenas "Painel Contábil implementado".

Gere relatório detalhado contendo:

## Funcionalidades

| Funcionalidade | Implementado | Testado | Resultado |
|---|---|---|---|

## Importação

Informar exatamente quais formatos foram testados.

## Conciliação

Informar quais cenários foram testados.

## Segurança

Informar testes de RLS e permissões.

## Banco

Informar tabelas criadas e relacionamentos.

## IA

Separar claramente:

- Implementado
- Preparado
- Não implementado

## Testes

Informar:

- Quantidade executada
- Passaram
- Falharam
- Parciais
- Não testados

## Bugs

Listar todos encontrados e correções.

## Pendências

Listar tudo que ainda precisa ser implementado.

Não invente resultados de testes.

Não marque como aprovado algo que não foi executado.

Ao finalizar, o sistema deve possuir uma fundação real para o Painel Contábil, mas não deve fingir que a inteligência contábil avançada já está pronta.