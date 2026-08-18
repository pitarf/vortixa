A Fase 2 está aprovada.

Você está autorizado a iniciar a **Fase 3: Banco de Dados e Sistema de Créditos Transacionais**.

Antes de implementar, faça uma revisão rápida da estratégia de sessão documentada na Fase 2 e mantenha uma estratégia única, coerente com a arquitetura stateless do VORIXA.

Não mantenha mecanismos de sessão duplicados sem necessidade arquitetural.

---

# 1. OBJETIVO

Implementar a estrutura definitiva do sistema de créditos do VORIXA.

O sistema de créditos é considerado uma parte **financeira e crítica da aplicação**.

A prioridade máxima deve ser:

- Consistência
- Integridade
- Concorrência
- Idempotência
- Auditoria
- Segurança
- Rastreabilidade

---

# 2. SALDO DO USUÁRIO

Cada usuário deverá possuir uma estrutura de saldo.

Exemplo conceitual:

```text
User
 ↓
CreditBalance
```

O saldo deverá ser controlado exclusivamente pelo backend.

O frontend apenas consulta e exibe.

Nunca permitir que o frontend defina diretamente o saldo.

---

# 3. TRANSAÇÕES DE CRÉDITOS

Criar histórico imutável de movimentações.

Cada movimentação deverá possuir, quando aplicável:

- ID
- Usuário
- Tipo
- Quantidade
- Saldo anterior
- Saldo posterior
- Origem
- Referência externa
- Job relacionado
- Pagamento relacionado
- Descrição
- Data
- Metadados

Tipos possíveis, por exemplo:

```text
PURCHASE
BONUS
CONSUMPTION
REFUND
ADJUSTMENT
REVERSAL
EXPIRATION
```

Avaliar tecnicamente os nomes finais e documentá-los.

Não apagar movimentações financeiras.

---

# 4. REGRA DE SALDO

O sistema deverá impedir:

```text
saldo < 0
```

exceto se existir uma regra explícita e documentada.

O comportamento padrão deverá ser bloquear o consumo quando não houver créditos suficientes.

---

# 5. CONCORRÊNCIA

Esse é um requisito crítico.

O sistema deverá funcionar corretamente quando o mesmo usuário realizar várias operações simultaneamente.

Exemplo:

Usuário possui:

```text
100 créditos
```

Cinco requisições simultâneas não podem consumir os mesmos 100 créditos repetidamente.

Utilizar transações PostgreSQL e mecanismo adequado de concorrência/locking.

Documentar a estratégia.

Criar testes específicos para concorrência.

---

# 6. IDEMPOTÊNCIA

Operações críticas deverão possuir proteção contra duplicação.

Exemplos:

- Webhook repetido
- Compra repetida
- Retry de operação
- Job repetido
- Reprocessamento

Uma mesma operação não pode gerar créditos duas vezes.

Criar identificadores/idempotency keys quando apropriado.

---

# 7. CONSUMO DE CRÉDITOS

Criar serviço centralizado para operações de crédito.

Exemplo conceitual:

```text
CreditService
├── getBalance()
├── addCredits()
├── consumeCredits()
├── refundCredits()
├── adjustCredits()
└── hasEnoughCredits()
```

A lógica não deve ficar espalhada por:

- API routes
- componentes React
- páginas
- serviços de IA

Todas as operações deverão passar por uma camada central.

---

# 8. USUÁRIO ILIMITADO

O sistema deverá suportar usuários com créditos ilimitados.

Essa regra deve existir no backend.

Exemplo conceitual:

```text
creditMode:
NORMAL
UNLIMITED
```

Usuários UNLIMITED não devem ter créditos descontados nas gerações.

Mesmo assim, as gerações devem continuar sendo registradas para fins de:

- Auditoria
- Estatísticas
- Custos
- Controle administrativo

---

# 9. CUSTO DA IA

Não confundir:

**Créditos do usuário**

com

**Custo real da API.**

Exemplo:

```text
Usuário:
100 créditos

Geração:
10 créditos

Custo fal.ai:
US$ 1,20
```

Essas informações devem ser registradas separadamente.

Isso será fundamental para posteriormente calcular:

- Margem
- Custo por geração
- Receita
- Rentabilidade
- Custo por usuário

---

# 10. PREÇOS DAS FERRAMENTAS

Os custos internos das ferramentas não devem ficar hardcoded.

Cada ferramenta/modelo deverá permitir configuração de:

```text
provider
model
tool
creditCost
providerCostEstimate
active
```

O administrador deverá poder alterar o custo em créditos posteriormente.

Não criar tela administrativa completa nesta fase.

Apenas estruturar corretamente o backend/banco.

---

# 11. PACOTES DE CRÉDITOS

Criar estrutura para pacotes de créditos.

Exemplo:

```text
CreditPackage

id
name
description
credits
price
bonusCredits
active
displayOrder
```

Exemplos futuros:

```text
100 créditos
500 créditos
1.000 créditos
5.000 créditos
```

Não criar ainda a integração de pagamento.

Apenas deixar a estrutura preparada.

---

# 12. PAGAMENTOS

Nesta fase NÃO integrar VorexPay.

Porém, a estrutura de banco deverá permitir futuramente:

```text
Payment
 ↓
PaymentItem
 ↓
CreditPackage
 ↓
CreditTransaction
```

O pagamento será implementado na Fase 6.

Não criar lógica falsa de pagamento.

---

# 13. ADMINISTRADOR

O administrador deverá posteriormente conseguir:

- Adicionar créditos
- Remover créditos
- Ajustar saldo
- Visualizar histórico
- Tornar usuário ilimitado

Nesta fase, implementar apenas a camada de serviço/backend necessária.

A interface administrativa será desenvolvida na Fase correspondente.

Toda alteração administrativa de créditos deverá gerar:

- CreditTransaction
- AuditLog

Nunca alterar saldo diretamente sem histórico.

---

# 14. BANCO DE DADOS

Revisar o `schema.prisma` atual.

Criar ou ajustar:

- CreditBalance
- CreditTransaction
- CreditPackage
- Relações necessárias

Avaliar índices.

Criar migrations versionadas.

Não alterar tabelas de autenticação sem necessidade.

---

# 15. TRANSAÇÕES

As operações críticas deverão utilizar transações PostgreSQL.

Exemplo:

```text
BEGIN
 ↓
Lock saldo
 ↓
Verificar saldo
 ↓
Atualizar saldo
 ↓
Criar CreditTransaction
 ↓
COMMIT
```

Se qualquer etapa falhar:

```text
ROLLBACK
```

Não permitir estados parcialmente atualizados.

---

# 16. TESTES OBRIGATÓRIOS

Criar testes para:

### Saldo

- Criar saldo
- Adicionar créditos
- Consumir créditos
- Bloquear saldo insuficiente
- Reembolsar créditos
- Ajustar créditos

### Concorrência

- Duas operações simultâneas
- Muitas operações simultâneas
- Saldo insuficiente em concorrência

### Idempotência

- Mesma operação duas vezes
- Mesmo identificador externo duas vezes
- Retry

### Usuário ilimitado

- Não descontar créditos
- Registrar consumo
- Alterar normal → ilimitado
- Alterar ilimitado → normal

### Integridade

- Nunca saldo negativo
- Histórico consistente
- Saldo anterior/posterior coerentes

---

# 17. PERFORMANCE

O sistema deverá continuar eficiente com grande quantidade de usuários e transações.

Utilizar:

- Índices
- Queries específicas
- Paginação
- Transações curtas
- Evitar consultas desnecessárias

Não carregar histórico completo de créditos para calcular saldo.

O saldo atual deverá estar disponível diretamente em `CreditBalance`.

O histórico será utilizado para auditoria.

---

# 18. DOCUMENTAÇÃO

Atualizar:

```text
/docs/DATABASE.md
/docs/CREDITS.md
/docs/API.md
/docs/SECURITY.md
/docs/ARCHITECTURE.md
/docs/TESTING.md
/docs/DECISIONS.md
/docs/CHANGELOG.md
```

Documentar detalhadamente:

- Modelo
- Regras
- Estados
- Transações
- Concorrência
- Idempotência
- Consumo
- Reembolso
- Usuários ilimitados
- Custos de IA
- Pacotes
- Testes

---

# 19. NÃO IMPLEMENTAR NESTA FASE

Não implementar:

- fal.ai
- VorexPay
- Checkout
- Ferramentas de IA
- Upload de geração
- Marketplace
- Assinaturas
- Landing page definitiva

Apenas construir a fundação do sistema de créditos.

---

# 20. REGRA FINAL

Ao terminar a Fase 3:

NÃO iniciar a Fase 4 automaticamente.

Apresentar:

- Arquivos criados
- Arquivos modificados
- Migration
- Estrutura do banco
- Serviços criados
- Regras de créditos
- Estratégia de concorrência
- Estratégia de idempotência
- Testes realizados
- Resultado dos testes
- Resultado do build
- Problemas encontrados
- Decisões técnicas
- Checklist da Fase 3

Aguardar autorização explícita antes de iniciar a Fase 4.