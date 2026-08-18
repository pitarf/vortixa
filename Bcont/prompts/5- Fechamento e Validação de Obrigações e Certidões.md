Antes de avançarmos para novos módulos, quero finalizar e validar completamente os módulos de Obrigações e Certidões.

A implementação atual de Obrigações foi validada e está funcionando, incluindo geração por regras, associação à empresa, filtros, conclusão/reabertura e indicadores do Dashboard.

Agora faça apenas os ajustes necessários para considerar esses módulos realmente concluídos.

## 1. VENCIMENTOS DAS OBRIGAÇÕES

Foi identificado que as regras atualmente cadastradas estão sem `due_rule`, fazendo com que algumas obrigações sejam geradas sem data de vencimento.

Corrija isso estruturalmente.

A regra de vencimento deve ser configurável em Administração > Configurações > Regras de Obrigações.

Não invente regras tributárias que não foram fornecidas.

A estrutura deve permitir configurar futuramente:

- Dia do vencimento
- Regra de cálculo
- Periodicidade
- Competência
- Data de vencimento
- Observações

Quando uma regra não possuir vencimento configurado, o sistema deve deixar isso claramente identificado e não inventar uma data.

## 2. OBRIGAÇÕES

Validar novamente:

- Geração por regra
- Geração em lote
- Empresa
- Competência
- Responsável
- Setor
- Periodicidade
- Vencimento
- Status
- Conclusão
- Reabertura
- Filtros
- Dashboard
- Aba de obrigações da empresa

Testar também uma obrigação com vencimento configurado e confirmar que ela aparece corretamente como:

- Próxima do vencimento
- Atrasada
- Concluída

conforme a data e o status.

## 3. CERTIDÕES

Agora validar de ponta a ponta o módulo de Certidões.

Testar:

- Criar certidão
- Selecionar empresa
- Selecionar tipo
- Upload de PDF
- Armazenamento privado
- Download autorizado
- Exclusão conforme permissão
- Data de emissão
- Data de validade
- Status
- Observações
- Histórico

Tipos:

- Federal
- Estadual
- Municipal

## 4. PENDÊNCIAS DE CERTIDÃO

Validar o cadastro de pendências.

Cada pendência deve permitir:

- Descrição
- Data de identificação
- Status
- Data de regularização
- Observação
- Responsável

Status:

- Pendente
- Em regularização
- Regularizada

## 5. COMPARAÇÃO DE CERTIDÕES

Validar se a estrutura permite associar uma nova certidão à anterior da mesma empresa e tipo.

Não implementar IA ainda.

Apenas garantir que o banco e a interface estejam preparados para futuramente comparar os documentos e identificar possíveis regularizações.

## 6. DASHBOARD

Confirmar que os indicadores de Certidões e Obrigações utilizam exclusivamente dados reais do banco.

Testar:

- Obrigações pendentes
- Obrigações atrasadas
- Obrigações próximas do vencimento
- Certidões válidas
- Certidões vencendo
- Certidões vencidas
- Certidões com pendência

## 7. SEGURANÇA

Testar novamente:

- RLS
- Acesso aos documentos
- Download por usuário autorizado
- Acesso de usuário comum
- Acesso de administrador

Um usuário sem permissão não pode acessar documentos privados de outra empresa.

## 8. NÃO IMPLEMENTAR AINDA

Não desenvolver nesta etapa:

- IA para leitura de certidões
- Conciliação contábil
- DRE
- Processamento de OFX
- Cruzamento inteligente de notas
- Integração de e-mail
- WhatsApp

Essas funcionalidades serão desenvolvidas posteriormente.

## 9. RESULTADO FINAL

Ao terminar, informe claramente:

- O que foi validado
- O que foi corrigido
- O que está 100% funcional
- O que ainda depende de configuração
- O que permanece pendente para etapas futuras

Não considere uma funcionalidade concluída apenas porque a interface existe. Quero confirmação baseada em testes reais de execução.