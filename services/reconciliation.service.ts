import prisma from "@/lib/prisma";

export interface ReconcileResult {
  discrepancies: {
    type: "PAYMENT_WITHOUT_ORDER" | "ORDER_WITHOUT_PAYMENT" | "PAID_WITHOUT_CREDITS" | "CREDITS_WITHOUT_PAYMENT" | "VALUE_MISMATCH";
    description: string;
    refId: string; // paymentId, orderId ou transactionId
  }[];
  isConsistent: boolean;
}

export class ReconciliationService {
  /**
   * Compara pagamentos externos/internos, pedidos e créditos concedidos para auditoria financeira.
   */
  static async runReconciliation(): Promise<ReconcileResult> {
    const discrepancies: ReconcileResult["discrepancies"] = [];

    // 1. Busca todos os pagamentos com seus pedidos e transações de créditos associadas
    const payments = await prisma.payment.findMany({
      include: {
        order: true,
        creditTx: true,
      },
    });

    for (const p of payments) {
      // Divergência 1: Pagamento sem pedido associado
      if (!p.orderId) {
        discrepancies.push({
          type: "PAYMENT_WITHOUT_ORDER",
          description: `Pagamento ID: ${p.id} não possui pedido (orderId) associado.`,
          refId: p.id,
        });
      }

      // Divergência 2: Divergência de valor comercial entre Order e Payment
      if (p.order && p.amountCents !== p.order.amountCents) {
        discrepancies.push({
          type: "VALUE_MISMATCH",
          description: `Divergência de valor: Order (${p.order.amountCents} cents) vs Payment (${p.amountCents} cents).`,
          refId: p.id,
        });
      }

      // Divergência 3: Pagamento confirmado (PAID), mas sem transação de crédito correspondente
      if (p.status === "PAID" && !p.creditTx) {
        discrepancies.push({
          type: "PAID_WITHOUT_CREDITS",
          description: `Pagamento confirmado ID: ${p.id} não possui transação de crédito correspondente.`,
          refId: p.id,
        });
      }
    }

    // 2. Busca todos os pedidos
    const orders = await prisma.order.findMany({
      include: {
        payments: true,
      },
    });

    for (const o of orders) {
      // Divergência 4: Pedidos sem nenhum registro de pagamento associado
      if (o.payments.length === 0) {
        discrepancies.push({
          type: "ORDER_WITHOUT_PAYMENT",
          description: `Pedido ID: ${o.id} não possui nenhum registro de pagamento.`,
          refId: o.id,
        });
      }
    }

    // 3. Busca transações de créditos de tipo PURCHASE que não possuem paymentId correspondente no banco
    const creditTxs = await prisma.creditTransaction.findMany({
      where: { type: "PURCHASE" },
    });

    for (const tx of creditTxs) {
      if (!tx.paymentId) {
        discrepancies.push({
          type: "CREDITS_WITHOUT_PAYMENT",
          description: `Crédito de compra ID: ${tx.id} concedido sem paymentId de referência.`,
          refId: tx.id,
        });
      } else {
        // Verifica se o pagamento referenciado existe
        const linkedPayment = payments.find(p => p.id === tx.paymentId);
        if (!linkedPayment) {
          discrepancies.push({
            type: "CREDITS_WITHOUT_PAYMENT",
            description: `Crédito de compra ID: ${tx.id} aponta para pagamento inexistente ID: ${tx.paymentId}.`,
            refId: tx.id,
          });
        }
      }
    }

    return {
      discrepancies,
      isConsistent: discrepancies.length === 0,
    };
  }

  /**
   * Executa ajustes manuais administrativos auditáveis, gravando o motivo na tabela AuditLog,
   * validando existência de usuário de destino, tipos de dados estritos e garantindo idempotência
   * estrita contra reutilizações indevidas ou com parâmetros divergentes (HTTP 409 Conflict).
   *
   * @param adminUserId ID do administrador autenticado que está realizando o ajuste
   * @param targetUserId ID do usuário destinatário que terá o saldo alterado
   * @param creditsAmount Quantidade inteira de créditos a adicionar (positivo) ou deduzir (negativo), diferente de 0
   * @param reason Motivo e justificativa do ajuste administrativo
   * @param idempotencyKey Chave opcional de idempotência enviada pelo cliente
   * @returns Objeto indicando se a operação já havia sido processada anteriormente
   */
  static async adjustCreditsManually(
    adminUserId: string,
    targetUserId: string,
    creditsAmount: number,
    reason: string,
    idempotencyKey?: string
  ): Promise<{ alreadyProcessed: boolean; transactionId?: string }> {
    // 1. Validação estrita de parâmetros obrigatórios e tipos
    if (!adminUserId || typeof adminUserId !== "string" || adminUserId.trim() === "") {
      const err: any = new Error("O ID do administrador (adminUserId) é obrigatório.");
      err.statusCode = 400;
      err.code = "INVALID_ADMIN_USER";
      throw err;
    }

    if (!targetUserId || typeof targetUserId !== "string" || targetUserId.trim() === "") {
      const err: any = new Error("O ID do usuário de destino (targetUserId) é obrigatório.");
      err.statusCode = 400;
      err.code = "INVALID_TARGET_USER";
      throw err;
    }

    if (
      creditsAmount === undefined ||
      creditsAmount === null ||
      typeof creditsAmount !== "number" ||
      !Number.isInteger(creditsAmount) ||
      creditsAmount === 0 ||
      !Number.isFinite(creditsAmount) ||
      Number.isNaN(creditsAmount)
    ) {
      const err: any = new Error("A quantidade de créditos deve ser um número inteiro diferente de zero.");
      err.statusCode = 400;
      err.code = "INVALID_CREDITS_AMOUNT";
      throw err;
    }

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      const err: any = new Error("O motivo do ajuste administrativo (reason) é obrigatório.");
      err.statusCode = 400;
      err.code = "INVALID_REASON";
      throw err;
    }

    // 2. Valida se quem está solicitando o ajuste é de fato um administrador
    const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== "ADMIN") {
      const err: any = new Error("Apenas administradores podem efetuar ajustes manuais de saldo.");
      err.statusCode = 403;
      err.code = "FORBIDDEN";
      throw err;
    }

    // 3. Validação explícita de existência do targetUserId antes de qualquer modificação de saldo
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser) {
      const err: any = new Error("Usuário alvo não encontrado.");
      err.statusCode = 404;
      err.code = "USER_NOT_FOUND";
      throw err;
    }

    // Helper interno para validar consistência dos parâmetros com transação idempotente existente
    const validateIdempotentMatch = (existingTx: {
      userId: string;
      amount: number;
      type: string;
    }) => {
      if (
        existingTx.userId !== targetUserId ||
        existingTx.amount !== creditsAmount ||
        existingTx.type !== "ADMIN_ADJUSTMENT"
      ) {
        const conflictErr: any = new Error(
          "Conflito: Chave de idempotência reutilizada com parâmetros divergentes."
        );
        conflictErr.statusCode = 409;
        conflictErr.code = "IDEMPOTENCY_CONFLICT";
        throw conflictErr;
      }
    };

    // 4. Se uma chave de idempotência foi fornecida, verifica se a operação já foi concluída anteriormente
    if (idempotencyKey) {
      const existingTx = await prisma.creditTransaction.findUnique({
        where: { idempotencyKey },
      });
      if (existingTx) {
        // Valida se os parâmetros conferem exatamente com a transação original
        validateIdempotentMatch(existingTx);
        return { alreadyProcessed: true, transactionId: existingTx.id };
      }
    }

    try {
      return await prisma.$transaction(async (tx) => {
        // 5. Lock pessimista do saldo de créditos para evitar race conditions
        await tx.$executeRaw`
          SELECT 1 FROM "CreditBalance" 
          WHERE "userId" = ${targetUserId} 
          FOR UPDATE
        `;

        // Verifica novamente dentro do lock se a chave já foi gravada por transação concorrente
        if (idempotencyKey) {
          const inTxExisting = await tx.creditTransaction.findUnique({
            where: { idempotencyKey },
          });
          if (inTxExisting) {
            validateIdempotentMatch(inTxExisting);
            return { alreadyProcessed: true, transactionId: inTxExisting.id };
          }
        }

        const balanceRecord = await tx.creditBalance.findUnique({
          where: { userId: targetUserId },
        });

        const currentBalance = balanceRecord?.balance || 0;
        const newBalance = currentBalance + creditsAmount;

        // 6. Atualiza saldo de forma atômica
        await tx.creditBalance.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, balance: newBalance },
          update: { balance: newBalance },
        });

        // 7. Grava transação do Ledger vinculando a chave de idempotência com constraint única
        const createdTx = await tx.creditTransaction.create({
          data: {
            userId: targetUserId,
            amount: creditsAmount,
            type: "ADMIN_ADJUSTMENT",
            description: `Ajuste manual administrativo: ${reason}`,
            idempotencyKey: idempotencyKey || undefined,
          },
        });

        // 8. Registra a ação de auditoria administrativa com autoria garantida pelo servidor
        await tx.auditLog.create({
          data: {
            userId: adminUserId,
            action: "MANUAL_CREDIT_ADJUSTMENT",
            details: `Ajuste manual de ${creditsAmount} créditos para o usuário ${targetUserId}. Motivo: ${reason}. Saldo anterior: ${currentBalance}, Novo saldo: ${newBalance}`,
          },
        });

        return { alreadyProcessed: false, transactionId: createdTx.id };
      });
    } catch (err: any) {
      if (err.statusCode) {
        throw err;
      }

      // 9. Tratamento de erro de unicidade (P2002) específico para idempotencyKey
      if (err.code === "P2002" && idempotencyKey) {
        const target = Array.isArray(err.meta?.target)
          ? err.meta.target.join(",")
          : (err.meta?.target || "");
        if (
          typeof target === "string" &&
          (target.includes("idempotencyKey") || target.includes("CreditTransaction_idempotencyKey_key"))
        ) {
          const racedTx = await prisma.creditTransaction.findUnique({
            where: { idempotencyKey },
          });
          if (racedTx) {
            validateIdempotentMatch(racedTx);
            return { alreadyProcessed: true, transactionId: racedTx.id };
          }
          return { alreadyProcessed: true };
        }
      }

      // Outros erros P2002 ou erros gerais sobem como erro real
      throw err;
    }
  }
}
