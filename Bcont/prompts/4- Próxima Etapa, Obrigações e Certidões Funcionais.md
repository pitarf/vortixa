Agora vamos avançar para a próxima etapa funcional do sistema.

O núcleo administrativo, empresas, tarefas, legalização e estrutura de documentos já foi implementado e validado.

Não faça uma reformulação visual geral.

Quero agora transformar os módulos de OBRIGAÇÕES e CERTIDÕES em funcionalidades reais e conectadas entre si e com as empresas.

## 1. OBRIGAÇÕES

Implementar o módulo de obrigações como um sistema configurável.

Cada obrigação deve estar relacionada a uma empresa e possuir, quando aplicável:

- Nome da obrigação
- Empresa
- Regime tributário
- Atividade
- Município
- Periodicidade
- Data de vencimento
- Responsável
- Setor
- Status
- Observações
- Data de conclusão
- Histórico

Status:

- Pendente
- Em andamento
- Concluída
- Atrasada
- Não aplicável

## 2. REGRAS DE OBRIGAÇÕES

Utilizar a estrutura de regras já criada.

O administrador deve conseguir configurar regras considerando:

- Regime tributário
- Atividade
- Município
- Existência de folha

Quando uma nova empresa for cadastrada ou suas características forem alteradas, o sistema deve conseguir identificar quais obrigações podem ser aplicáveis.

IMPORTANTE:

Não inventar regras tributárias.

Utilizar somente as regras já cadastradas no sistema e permitir que o administrador cadastre novas regras.

A estrutura deve permitir expansão futura.

## 3. GERAÇÃO DE OBRIGAÇÕES

Criar uma forma de gerar as obrigações aplicáveis para uma empresa.

Exemplo:

Empresa:
- Lucro Presumido
- Serviço
- Recife
- Possui folha

O sistema deve consultar as regras cadastradas e apresentar as obrigações correspondentes.

Não criar obrigações automaticamente com regras que não estejam cadastradas.

## 4. VISÃO DA EMPRESA

Na página da empresa, a aba "Obrigações" deve apresentar:

- Obrigações pendentes
- Em andamento
- Concluídas
- Atrasadas
- Próximos vencimentos

Permitir filtros por:

- Status
- Período
- Responsável
- Setor

## 5. CALENDÁRIO / VENCIMENTOS

Criar uma visualização dos próximos vencimentos.

Permitir visualizar:

- Obrigação
- Empresa
- Responsável
- Data
- Status

Destacar obrigações atrasadas e próximas do vencimento.

## 6. CERTIDÕES

Transformar o módulo de certidões em funcional.

Cada certidão deve possuir:

- Empresa
- Tipo
- Documento
- Data de emissão
- Data de validade
- Status
- Observações
- Histórico

Tipos inicialmente:

- Federal
- Estadual
- Municipal

## 7. UPLOAD

Manter o bucket privado já configurado.

Ao enviar uma certidão:

- Associar o arquivo à empresa
- Registrar usuário que realizou o upload
- Registrar data
- Armazenar o caminho seguro do arquivo
- Permitir download autorizado
- Permitir exclusão somente para usuários autorizados

## 8. STATUS DA CERTIDÃO

Criar estados como:

- Válida
- Vencida
- Com pendência
- Em análise
- Regularizada

O sistema deve conseguir destacar certidões próximas do vencimento.

## 9. HISTÓRICO DE PENDÊNCIAS

Criar estrutura para registrar pendências identificadas em uma certidão.

Cada pendência deve possuir:

- Descrição
- Data de identificação
- Status
- Data de regularização
- Observação
- Usuário responsável

Status:

- Pendente
- Em regularização
- Regularizada

## 10. COMPARAÇÃO ENTRE CERTIDÕES

Preparar o sistema para permitir que uma nova certidão seja comparada com a anterior.

Neste momento, implementar apenas a estrutura de comparação dos documentos e registros.

Não utilizar IA ainda para afirmar automaticamente que uma pendência foi regularizada.

O resultado deverá futuramente permitir algo como:

Certidão anterior:
Pendência X

Nova certidão:
Pendência X não encontrada

Resultado:
"Possível regularização identificada"

O usuário deverá confirmar a regularização.

## 11. IA PARA CERTIDÕES

Preparar a arquitetura para futuramente utilizar IA para:

- Ler o PDF
- Identificar informações
- Identificar pendências
- Extrair datas
- Gerar resumo

Não implementar uma IA simulada.

Se não houver integração real disponível, deixar a funcionalidade claramente preparada para receber a integração posteriormente.

## 12. DASHBOARD

Atualizar o Dashboard utilizando dados reais desses módulos.

Adicionar indicadores:

- Obrigações pendentes
- Obrigações atrasadas
- Obrigações próximas do vencimento
- Certidões válidas
- Certidões vencendo
- Certidões vencidas
- Certidões com pendência

Todos os indicadores devem vir do banco.

## 13. NOTIFICAÇÕES

Preparar estrutura para futuramente notificar:

- Obrigação próxima do vencimento
- Obrigação atrasada
- Certidão próxima do vencimento
- Certidão vencida
- Nova pendência

Não implementar envio por e-mail ou WhatsApp ainda.

## 14. TESTES

Depois de implementar:

- Criar empresa de teste
- Configurar regime, atividade e município
- Criar regras de obrigação
- Gerar obrigações
- Alterar status
- Testar vencimentos
- Fazer upload de certidão
- Testar download autorizado
- Testar acesso sem permissão
- Testar histórico
- Testar filtros
- Testar Dashboard

Verificar:

- RLS
- Permissões
- API
- Console
- TypeScript
- ESLint
- Responsividade

Não considerar a funcionalidade concluída apenas porque a tela existe.

Quero o fluxo funcionando de ponta a ponta.

Ao finalizar, informe:

1. O que foi implementado
2. O que foi testado
3. O que ainda depende de IA ou integração externa
4. Problemas encontrados
5. Próxima etapa recomendada