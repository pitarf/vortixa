# DEVELOPMENT RULES - VORIXA

Este documento define as regras fundamentais de desenvolvimento técnico para o VORIXA. Todo desenvolvedor deve segui-las sem exceções.

## 1. Regras de Código e Boas Práticas

1. **Sem Código Duplicado**: Componentes e lógicas de negócios compartilhadas devem ser isolados em hooks customizados, utilitários (`/lib` ou `/utils`) ou serviços dedicados.
2. **Nenhuma Regra de Negócio Crítica no Frontend**: Lógicas de permissão, liberação de créditos, cálculo de transações financeiras e validação de pagamento devem ser executadas e validadas exclusivamente no backend.
3. **Validação Rigorosa de Entrada**: Toda requisição recebida no backend deve ser validada usando a biblioteca **Zod** para garantir tipos corretos e prevenir injeções/erros.
4. **Comentários Obrigatórios**: Todos os componentes, controllers, hooks e funções criadas devem conter documentação em código detalhando sua finalidade, parâmetros e retorno.

## 2. Regras de Banco de Dados e Transições de Estado

1. **Alterações via Migrations**: É estritamente proibido alterar o banco de dados de produção ou desenvolvimento de forma manual. Qualquer alteração de esquema deve ocorrer via `prisma migrate dev`.
2. **Integridade Financeira Transacional**: Todas as operações que afetem o saldo de créditos do usuário (compra, débito de geração, estorno por falha, ajuste administrativo) devem utilizar `prisma.$transaction` para evitar inconsistências por concorrência ou falhas de rede.
3. **Imutabilidade de Histórico**: Registros de transações de crédito (`CreditTransaction`) e logs de auditoria (`AuditLog`) não devem ser atualizados ou apagados. Alterações de saldo devem ser registradas através de novas linhas de ajuste.
4. **Otimização de Consultas e Índices**: Toda nova consulta adicionada no backend que filtre por colunas além do ID primário deve ter seu índice correspondente mapeado no arquivo `schema.prisma`. É proibido realizar buscas sequenciais em tabelas com potencial de crescimento rápido.
5. **Paginação Obrigatória**: Todos os endpoints de listagem de histórico (jobs, galeria, logs e transações) devem obrigatoriamente implementar paginação baseada em cursor ou offset.

## 3. Segurança e Variáveis de Ambiente

1. **Proteção de Secrets**: Jamais insira chaves de API, credenciais de banco ou webhook secrets diretamente no código-fonte. Utilize o arquivo `.env` local e mantenha o `.env.example` sempre atualizado.
2. **Armazenamento de Senhas**: As senhas de usuários devem ser transformadas em hashes seguros utilizando algoritmos modernos (bcrypt/argon2) antes de serem salvas no PostgreSQL.
3. **Segurança de Endpoints de Webhooks**: Os endpoints de webhooks (da fal.ai e do gateway VorexPay) devem conter validações de assinatura baseadas nos respectivos secrets configurados no backend.

## 4. Regras de Escalabilidade e Estado

1. **Proibição de Estado em Filesystem**: É estritamente proibido salvar arquivos definitivos, logs em disco local ou sessões de usuários no filesystem da instância em execução. A aplicação deve operar de forma 100% stateless para permitir balanceamento horizontal.
2. **Tratamento de Arquivos Temporários**: Se downloads locais temporários forem necessários para processamento (ex: download do webhook antes de enviar ao R2), os arquivos devem ser gravados em `/tmp` e obrigatoriamente apagados no mesmo ciclo de vida da requisição (bloco `finally`).

## 5. Perguntas de Validação Crítica e Financeira

Antes de considerar qualquer funcionalidade financeira ou transacional concluída, o desenvolvedor deve obrigatoriamente responder e validar os seguintes cenários no código e na especificação:

1. **O que acontece se o usuário clicar duas vezes?** (Frontend desabilita botão e backend aplica chaves de idempotência).
2. **O que acontece se clicar 10 vezes consecutivas?** (A camada de banco com locking ou restrições de unicidade impede execuções adicionais).
3. **O que acontece se a requisição de rede for reenviada?** (O backend descarta baseado na idempotency key).
4. **O que acontece se a conexão do cliente cair no meio do fluxo?** (A operação permanece consistente no banco; o frontend lê o estado sincronizado ao restabelecer).
5. **O que acontece se o webhook de pagamento chegar duas vezes?** (O banco rejeita o reprocessamento baseado em chaves exclusivas de ID de transação).
6. **O que acontece se os webhooks chegarem fora de ordem?** (O backend valida a máquina de estados antes de efetuar a transição).
7. **O que acontece se o usuário abrir duas abas do navegador simultâneas?** (O Pessimistic Locking bloqueia a linha de saldo impedindo double spending).
8. **O que acontece se duas requisições financeiras forem estritamente simultâneas?** (O PostgreSQL sequencializa as transações através do `FOR UPDATE`).
9. **O que acontece se o processo do servidor cair no meio da transação?** (O banco faz `ROLLBACK` automático e nenhum estado parcial é salvo).
10. **O que acontece se o pagamento for confirmado no banco mas o frontend do cliente fechar?** (O saldo é garantido e persistido no banco; o cliente verá ao relogar).
11. **O que acontece se o job de IA falhar após o débito inicial?** (O sistema dispara o fluxo transacional de reembolso `GENERATION_REFUND`).
12. **O que acontece se o usuário tentar manipular as variáveis do request?** (O backend adota arquitetura Zero Trust, recalculando e validando preços e limites no lado do servidor).


