# NOVAS DIRETRIZES GLOBAIS DO VORIXA

Estas regras passam a fazer parte das diretrizes permanentes do projeto e devem ser respeitadas em todas as fases futuras.

Atualize a documentação correspondente e registre estas decisões em:

`/docs/DECISIONS.md`

Também atualize:

- `/docs/DEVELOPMENT_RULES.md`
- `/docs/FRONTEND.md`
- `/docs/SECURITY.md`
- `/docs/CREDITS.md`
- `/docs/PAYMENTS.md`
- `/docs/AI_INTEGRATIONS.md`
- `/docs/TESTING.md`

---

# 1. MOBILE FIRST FUNCIONAL

O VORIXA não deve ser apenas "responsivo".

Toda interface deve ser **realmente funcional e user-friendly em dispositivos móveis**.

Responsividade significa que a interface se adapta.

Mobile UX significa que a interface continua sendo fácil, rápida e intuitiva de utilizar.

Ambos são obrigatórios.

---

# 2. REGRA PARA TODAS AS TELAS

Toda nova tela desenvolvida deverá ser validada em pelo menos:

- Mobile pequeno
- Mobile grande
- Tablet
- Notebook
- Desktop

Não considerar uma tela concluída apenas porque não apresenta overflow horizontal.

Também devem ser avaliados:

- Tamanho dos elementos
- Áreas de toque
- Espaçamento
- Hierarquia visual
- Legibilidade
- Navegação
- Formulários
- Uploads
- Modais
- Menus
- Feedback de ações
- Loading
- Estados de erro
- Estados vazios

---

# 3. MOBILE NÃO DEVE SER UMA VERSÃO REDUZIDA DO DESKTOP

Quando determinado componente não funcionar bem em uma tela pequena, não simplesmente reduza sua largura.

Crie uma representação apropriada para mobile.

Exemplos:

### Desktop

Tabela com várias colunas.

### Mobile

Cards, lista, accordion, informações empilhadas ou outro padrão apropriado.

Outro exemplo:

### Desktop

Sidebar fixa.

### Mobile

Menu lateral recolhível, bottom navigation ou outra solução adequada.

Outro exemplo:

### Desktop

Formulário com múltiplas colunas.

### Mobile

Campos organizados verticalmente e agrupados logicamente.

A decisão deve priorizar usabilidade.

---

# 4. TABELAS

Tabelas nunca devem ser consideradas obrigatórias no mobile.

Antes de implementar uma tabela, avaliar:

"Essa informação continua sendo a melhor forma de apresentação em uma tela pequena?"

Se não:

Desktop:

```text
Table
```

Mobile:

```text
Card/List/Accordion
```

A informação e as ações devem permanecer completas.

Não simplesmente esconder colunas importantes no mobile.

---

# 5. COMPONENTES INTERATIVOS

Componentes devem ser projetados considerando toque.

Evitar:

- Botões pequenos
- Links muito próximos
- Áreas de clique difíceis
- Menus que exigem precisão excessiva
- Hover como único mecanismo de descoberta
- Funcionalidade existente somente via mouse

Toda ação importante deve funcionar através de touch.

---

# 6. UPLOAD E GERAÇÃO DE IA NO MOBILE

As principais ferramentas de IA deverão funcionar adequadamente em celular.

O usuário deverá conseguir:

- Selecionar arquivo
- Tirar foto quando aplicável
- Escolher vídeo
- Inserir prompt
- Configurar parâmetros
- Iniciar geração
- Acompanhar progresso
- Visualizar resultado
- Baixar/compartilhar resultado

Não criar uma experiência que funcione apenas em desktop.

---

# 7. CRÉDITOS E DINHEIRO

Qualquer funcionalidade que envolva:

- Créditos
- Compra
- Pagamento
- Estorno
- Reembolso
- Geração de IA
- Benefícios
- Bônus
- Usuário ilimitado

deve ser tratada como **operação financeira crítica**.

O frontend nunca deve ser considerado fonte confiável para essas operações.

---

# 8. PRINCÍPIO ZERO TRUST

Nunca confiar em:

- Botão desabilitado
- Estado React
- JavaScript do navegador
- Valor enviado pelo frontend
- Quantidade enviada pelo frontend
- Preço enviado pelo frontend
- Custo enviado pelo frontend
- Status enviado pelo frontend
- ID enviado pelo frontend sem validação

O backend deve sempre recalcular e validar as informações críticas.

---

# 9. DUPLO CLIQUE / MÚLTIPLAS REQUISIÇÕES

Toda operação crítica deve ser protegida contra execução duplicada.

Exemplos:

Usuário clica duas vezes:

```text
GERAR
GERAR
```

Não podem ser criados dois jobs se a intenção era uma única operação.

Usuário clica várias vezes:

```text
COMPRAR
COMPRAR
COMPRAR
```

Não podem ser criadas três operações financeiras indevidas.

Implementar proteção em múltiplas camadas:

### Frontend

- Desabilitar botão durante processamento
- Estado de loading
- Feedback visual

### Backend

- Idempotency key
- Validação de estado
- Controle de concorrência
- Transação

### Banco

- Constraints
- Unique indexes
- Integridade referencial

IMPORTANTE:

Desabilitar o botão no frontend **não é considerado proteção suficiente**.

---

# 10. DUPLICAÇÃO DE JOBS DE IA

Uma mesma solicitação não deve gerar múltiplos jobs simplesmente porque:

- Usuário clicou várias vezes
- Navegador reenviou requisição
- Rede repetiu request
- Usuário atualizou a página
- Cliente perdeu conexão
- Request sofreu retry

Cada operação deverá possuir um identificador único/idempotency key quando apropriado.

O backend deve decidir se a solicitação é:

- Nova
- Duplicada
- Já processada
- Em processamento
- Concluída
- Falha

---

# 11. CRÉDITOS

O sistema de créditos deverá possuir proteção contra:

- Double spend
- Race condition
- Requisições simultâneas
- Replay
- Retry
- Manipulação de parâmetros
- Jobs duplicados
- Reembolso duplicado
- Bônus duplicado
- Compra duplicada

A estratégia de PostgreSQL locking e transações definida na Fase 3 deve ser mantida.

---

# 12. PAGAMENTOS

Quando o VorexPay for integrado:

Nunca considerar um pagamento confirmado apenas porque o frontend recebeu uma resposta positiva.

O pagamento só poderá alterar o saldo quando o backend:

1. Receber o evento oficial.
2. Validar a autenticidade.
3. Validar o pagamento.
4. Validar o valor.
5. Validar a moeda.
6. Validar o pedido.
7. Validar o usuário.
8. Verificar idempotência.
9. Confirmar que ainda não foi processado.
10. Registrar a transação.
11. Liberar os créditos dentro de uma operação transacional.

---

# 13. CANCELAMENTO

Botão de cancelar não significa automaticamente:

"desfazer a operação financeira".

Toda operação deverá possuir máquina de estados.

Exemplo de pagamento:

```text
PENDING
    ↓
PROCESSING
    ↓
PAID
```

ou:

```text
PENDING
    ↓
CANCELLED
```

ou:

```text
PENDING
    ↓
FAILED
```

Depois de `PAID`, não permitir simplesmente retornar para `PENDING` através de uma ação do frontend.

Estornos devem seguir fluxo próprio e auditável.

---

# 14. REEMBOLSOS

Reembolso nunca deve simplesmente:

```text
saldo += créditos
```

sem registro.

Deve gerar uma nova transação de crédito do tipo:

```text
REFUND
```

com referência ao job/pagamento original.

O sistema deve impedir o mesmo reembolso de ser processado duas vezes.

---

# 15. CANCELAMENTO DE GERAÇÃO

Definir claramente o comportamento financeiro de:

- Job pendente
- Job em processamento
- Job concluído
- Job falho
- Job cancelado

Documentar quando:

- Crédito é reservado
- Crédito é consumido
- Crédito é estornado

A regra deverá ser consistente em todos os modelos de IA.

Não permitir que cada tela implemente sua própria regra.

---

# 16. AUDITORIA

Toda operação sensível deverá deixar rastreabilidade.

Registrar, quando aplicável:

- Usuário
- IP
- User Agent
- Data/hora
- Operação
- Resultado
- ID da operação
- ID do job
- ID do pagamento
- Quantidade de créditos
- Valor financeiro
- Estado anterior
- Estado posterior
- Motivo
- Origem

Operações administrativas críticas também devem gerar `AuditLog`.

---

# 17. DETECÇÃO DE COMPORTAMENTO SUSPEITO

A arquitetura deverá permitir futuramente identificar padrões como:

- Muitas requisições em poucos segundos
- Tentativas repetidas de pagamento
- Muitas falhas de pagamento
- Muitos jobs cancelados
- Tentativas repetidas de webhook
- Alterações administrativas incomuns
- Uso anormal de créditos
- Muitas contas originadas do mesmo contexto técnico
- Tentativas repetidas de acesso negado

Não criar um sistema complexo de antifraude nesta fase.

Apenas garantir que os eventos necessários sejam registrados para futura análise.

---

# 18. RATE LIMITING

Aplicar rate limiting especialmente em:

- Login
- Cadastro
- Recuperação de senha
- APIs de geração
- Upload
- Compra
- Checkout
- Webhooks
- Endpoints administrativos

Os limites devem ser configuráveis.

Não depender apenas do IP.

Sempre que apropriado, combinar:

- IP
- Usuário
- Endpoint
- Ferramenta
- Operação

---

# 19. WEBHOOKS

Todos os webhooks financeiros e de IA deverão ser tratados como potencialmente:

- Duplicados
- Fora de ordem
- Reenviados
- Atrasados
- Malformados
- Fraudulentos

Nunca assumir que um webhook será recebido apenas uma vez.

Nunca confiar na ordem dos eventos sem validar o estado atual.

---

# 20. TESTES DE SEGURANÇA FINANCEIRA

Criar testes específicos para:

### Cliques repetidos

- 2 requests simultâneos
- 10 requests simultâneos
- 100 requests simultâneos quando apropriado

### Compra

- Compra duplicada
- Webhook duplicado
- Webhook fora de ordem
- Valor incorreto
- Pedido inexistente
- Usuário inexistente
- Pagamento já processado

### Geração

- Job duplicado
- Idempotency key duplicada
- Crédito insuficiente
- Crédito consumido simultaneamente
- Job falho
- Estorno duplicado

### Admin

- USER tentando alterar créditos
- USER tentando acessar admin
- ADMIN realizando ajuste
- Ajuste duplicado

---

# 21. REGRA DE DESENVOLVIMENTO

Antes de considerar uma funcionalidade financeira concluída, responder:

1. O que acontece se o usuário clicar duas vezes?
2. O que acontece se clicar 10 vezes?
3. O que acontece se a requisição for reenviada?
4. O que acontece se a conexão cair?
5. O que acontece se o webhook chegar duas vezes?
6. O que acontece se chegar fora de ordem?
7. O que acontece se o usuário abrir duas abas?
8. O que acontece se duas requisições forem simultâneas?
9. O que acontece se o processo cair no meio?
10. O que acontece se o pagamento for confirmado mas o frontend fechar?
11. O que acontece se o job falhar depois do débito?
12. O que acontece se o usuário tentar manipular o request?

Nenhuma funcionalidade crítica será considerada concluída sem respostas documentadas para esses cenários.

---

# 22. PERFORMANCE E UX MOBILE

Toda implementação futura deverá considerar:

**Desktop UX + Mobile UX + Segurança + Concorrência.**

Não considerar uma funcionalidade pronta apenas porque funciona tecnicamente.

Ela precisa:

- Funcionar
- Ser segura
- Ser intuitiva
- Ser responsiva
- Ser acessível
- Funcionar por touch
- Possuir estados de loading
- Possuir estados de erro
- Possuir estados vazios
- Possuir feedback adequado

---

# 23. REGRA FINAL

Estas diretrizes passam a ser **regras globais do VORIXA**.

Todas as fases futuras deverão respeitá-las.

Não criar uma exceção sem registrar e justificar a decisão em:

`/docs/DECISIONS.md`

Após atualizar a documentação, NÃO avance automaticamente para a próxima fase.

Apresente:

- Arquivos atualizados
- Decisões registradas
- Regras adicionadas
- Impacto na arquitetura
- Impacto na Fase 3
- Testes adicionais necessários

Aguarde autorização explícita.