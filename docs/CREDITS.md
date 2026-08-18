# CREDIT SYSTEM SPECIFICATION - VORIXA

Este documento detalha o funcionamento técnico, regras de negócio e estratégias de concorrência/idempotência do sistema de créditos da plataforma VORIXA.

---

## 1. Arquitetura e Modelagem de Dados

O sistema de créditos foi desenvolvido como uma camada crítica financeira, composta por três entidades no banco de dados PostgreSQL:

* **`CreditBalance`**: Armazena o saldo consolidado atual de cada usuário.
* **`CreditTransaction`**: Ledger imutável de movimentações financeiras. Contém informações detalhadas de saldo anterior, posterior, tipo, descrição e chaves de relações externas (`paymentId`, `jobId`).
* **`CreditPackage`**: Cadastra os pacotes de créditos disponíveis para comercialização, suportando preço (BRL) e créditos bônus configurados pelo administrador.

---

## 2. Regras de Saldo e Consumo

* **Saldo Mínimo**: Por padrão, o saldo do usuário nunca pode ser inferior a zero (`balance >= 0`). Qualquer tentativa de débito que ultrapasse o saldo disponível é rejeitada com a exceção `"Saldo insuficiente de créditos."`.
* **Usuários Ilimitados (`isUnlimited`)**: Usuários corporativos ou administradores sinalizados como `isUnlimited: true` ignoram as verificações e débitos de saldo, porém todas as suas gerações continuam sendo registradas na tabela `CreditTransaction` com custo zero para fins de auditoria e cálculo de custos de provedores.
* **Separação de Custos**:
  * **Custo em Créditos**: O valor debitado do saldo interno do usuário (ex: 10 créditos).
  * **Custo de IA (fal.ai)**: O custo em dólares cobrado pela API (ex: US$ 0.12). Registrado separadamente na tabela de Jobs para análises de margem e lucratividade posterior.

---

## 3. Estratégia de Concorrência (Locking)

Para evitar condições de corrida (por exemplo, um usuário disparar 5 abas simultâneas de geração com saldo limitado), adotamos o **Pessimistic Locking** do PostgreSQL:

1. A operação de débito é encapsulada em uma transação do Prisma (`prisma.$transaction`).
2. A linha de saldo correspondente ao usuário é bloqueada no início da transação usando uma query nativa:
   ```sql
   SELECT 1 FROM "CreditBalance" WHERE "userId" = $1 FOR UPDATE;
   ```
3. O PostgreSQL bloqueia alterações concorrentes nessa linha até que a transação dê `COMMIT` ou `ROLLBACK`.
4. Com a garantia de isolamento, lemos o saldo atual, validamos o limite, aplicamos a subtração e inserimos a transação de histórico de forma estritamente atômica.

---

## 4. Estratégia de Idempotência

* **Prevenção de Compras Duplicadas**: O método `addCredits` aceita uma chave de idempotência (`paymentId`), que é indexada como `@unique` no banco. Se o gateway de pagamento (VorexPay/Stripe) enviar webhooks repetidos ou se houver retentativas automáticas, a transação correspondente é detectada e a operação de adição é abortada, retornando o saldo atual de sucesso sem duplicar os créditos gerados.
* **Prevenção de Reembolsos Duplos**: O estorno de créditos por jobs de geração que falharam é rastreado na tabela de transações buscando por tipos `GENERATION_REFUND` vinculados à descrição contendo o `jobId` correspondente. Se um reembolso já foi executado, as chamadas subsequentes são ignoradas com sucesso.

---

## 5. Prevenção de Double Spend e Regras de Estorno

* **Controle de Clique Duplo**: Toda solicitação de consumo de créditos do frontend gera uma assinatura única ou consome chaves de idempotência de requisição para evitar que envios repetidos de pacotes de rede (retries ou múltiplos cliques rápidos do usuário) cobrem o saldo duas vezes.
* **Orquestração de Reembolsos**: Estornos não incrementam saldo diretamente sem histórico. Eles geram obrigatoriamente um registro de `CreditTransaction` do tipo `GENERATION_REFUND` vinculando a descrição do reembolso ao job original. O saldo é recalculado de forma transacional usando o lock do Postgres.
