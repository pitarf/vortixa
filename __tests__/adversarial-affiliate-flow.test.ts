import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { AffiliateService } from "@/services/affiliate.service";
import { PaymentLedgerService } from "@/services/payment-ledger.service";

describe("Adversarial Affiliate & Referral System Test Suite (Fase 15)", () => {
  let affiliateUser: any;
  let affiliateProfile: any;
  let referredUser: any;
  let adminUser: any;

  beforeAll(async () => {
    // 1. Cria usuário afiliado
    affiliateUser = await prisma.user.create({
      data: {
        email: `affiliate_${Date.now()}@test.com`,
        name: "Test Affiliate",
      },
    });

    affiliateProfile = await AffiliateService.getOrCreateAffiliateProfile(affiliateUser.id);

    // 2. Cria usuário indicado
    referredUser = await prisma.user.create({
      data: {
        email: `referred_${Date.now()}@test.com`,
        name: "Test Referred Client",
      },
    });

    await prisma.creditBalance.create({
      data: { userId: referredUser.id, balance: 10 },
    });

    // 3. Cria admin para aprovação de saques
    adminUser = await prisma.user.create({
      data: {
        email: `admin_aff_${Date.now()}@test.com`,
        name: "Admin Tester",
        role: "ADMIN",
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    if (referredUser) {
      await prisma.user.delete({ where: { id: referredUser.id } }).catch(() => {});
    }
    if (affiliateUser) {
      await prisma.user.delete({ where: { id: affiliateUser.id } }).catch(() => {});
    }
    if (adminUser) {
      await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
    }
  });

  it("1. Deve vincular corretamente o cliente indicado ao afiliado e bloquear auto-indicação", async () => {
    // Bloqueia auto-indicação (afiliado tentando indicar a si próprio)
    const selfReferral = await AffiliateService.processReferralRegistration(
      affiliateUser.id,
      affiliateProfile.code
    );
    expect(selfReferral).toBe(false);

    // Vincula com sucesso o novo usuário indicado
    const linked = await AffiliateService.processReferralRegistration(
      referredUser.id,
      affiliateProfile.code
    );
    expect(linked).toBe(true);

    // Segunda tentativa de vincular o mesmo usuário deve ser ignorada (1 indicação por usuário)
    const duplicateLink = await AffiliateService.processReferralRegistration(
      referredUser.id,
      affiliateProfile.code
    );
    expect(duplicateLink).toBe(false);
  });

  it("2. Deve calcular e creditar atomicamente a comissão no saldo do afiliado na compra de créditos", async () => {
    // Cria pedido e pagamento para o usuário indicado (R$ 100,00 = 10.000 centavos)
    const testOrder = await prisma.order.create({
      data: {
        userId: referredUser.id,
        packageId: "pack-affiliate-test",
        amountCents: 10000,
        creditsGranted: 100,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: referredUser.id,
        orderId: testOrder.id,
        amountCents: 10000,
        creditsGranted: 100,
        status: PaymentStatus.PENDING,
        gateway: "mercadopago",
        gatewayTxId: `tx_aff_${Date.now()}`,
      },
    });

    const idempotencyKey = `idemp_aff_${Date.now()}`;

    // Confirma pagamento via PaymentLedgerService
    await PaymentLedgerService.confirmPayment(payment.id, payment.gatewayTxId, idempotencyKey);

    // Verifica comissão: 15% de 10.000 centavos = 1.500 centavos (R$ 15,00)
    const commission = await prisma.affiliateCommission.findUnique({
      where: { paymentId: payment.id },
    });

    expect(commission).not.toBeNull();
    expect(commission?.commissionAmountCents).toBe(1500);
    expect(commission?.status).toBe("APPROVED");
    expect(commission?.affiliateId).toBe(affiliateProfile.id);

    // Verifica atualização no saldo do perfil do afiliado
    const updatedProfile = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    });

    expect(updatedProfile?.balanceCents).toBe(1500);
    expect(updatedProfile?.totalEarningsCents).toBe(1500);
  });

  it("3. Idempotência estrita: Retentativa do webhook de pagamento não deve duplicar a comissão", async () => {
    const commissionBefore = await prisma.affiliateCommission.findMany({
      where: { affiliateId: affiliateProfile.id },
    });

    const profileBefore = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    });

    // Simula pagamento existente já processado
    const existingPayment = await prisma.payment.findFirst({
      where: { userId: referredUser.id, status: PaymentStatus.PAID },
    });

    if (existingPayment) {
      // Reexecuta processPaymentCommission dentro de transação mockada
      await prisma.$transaction(async (tx) => {
        const res = await AffiliateService.processPaymentCommission(tx, existingPayment);
        expect(res).not.toBeNull();
      });
    }

    const commissionAfter = await prisma.affiliateCommission.findMany({
      where: { affiliateId: affiliateProfile.id },
    });

    const profileAfter = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    });

    // Quantidade de registros e saldo devem permanecer estritamente inalterados
    expect(commissionAfter.length).toBe(commissionBefore.length);
    expect(profileAfter?.balanceCents).toBe(profileBefore?.balanceCents);
    expect(profileAfter?.totalEarningsCents).toBe(profileBefore?.totalEarningsCents);
  });

  it("4. Validação e Segurança na Solicitação de Saque Pix (Valores, Saldo e Chave Pix)", async () => {
    // 1. Tentar sacar sem chave Pix cadastrada
    await expect(
      AffiliateService.requestPayout(affiliateUser.id, 5000)
    ).rejects.toThrow("Cadastre sua chave Pix");

    // 2. Cadastra chave Pix
    await AffiliateService.updatePixKey(affiliateUser.id, "12345678909", "CPF");

    // 3. Tentar sacar valor abaixo do mínimo (R$ 49,00 = 4900 centavos)
    await expect(
      AffiliateService.requestPayout(affiliateUser.id, 4900)
    ).rejects.toThrow("O valor mínimo para solicitação de saque");

    // 4. Tentar sacar mais do que o saldo disponível (ex: R$ 500,00 tendo R$ 15,00)
    await expect(
      AffiliateService.requestPayout(affiliateUser.id, 50000)
    ).rejects.toThrow("Saldo insuficiente");

    // Concede saldo adicional suficiente para atingir o teto de saque
    await prisma.affiliateProfile.update({
      where: { id: affiliateProfile.id },
      data: { balanceCents: 6000 }, // R$ 60,00
    });

    // 5. Solicita saque válido de R$ 50,00 (5000 centavos)
    const payout = await AffiliateService.requestPayout(affiliateUser.id, 5000);
    expect(payout.amountCents).toBe(5000);
    expect(payout.status).toBe("PENDING");
    expect(payout.pixKey).toBe("12345678909");

    // Saldo disponível deve ter sido debitado imediatamente para R$ 10,00 (1000 centavos)
    const profileAfterPayout = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    });
    expect(profileAfterPayout?.balanceCents).toBe(1000);

    // 6. Bloquear segundo saque enquanto o primeiro estiver em análise
    await expect(
      AffiliateService.requestPayout(affiliateUser.id, 5000)
    ).rejects.toThrow("Você já possui uma solicitação de saque em análise");
  });

  it("5. Governança Administrativa: Rejeição com estorno automático e Aprovação com liquidação Pix", async () => {
    const pendingPayout = await prisma.affiliatePayout.findFirst({
      where: { affiliateId: affiliateProfile.id, status: "PENDING" },
    });
    expect(pendingPayout).not.toBeNull();

    // CENÁRIO A: Rejeição do saque (deve estornar os R$ 50,00 de volta ao saldo do afiliado)
    const rejectedPayout = await AffiliateService.adminProcessPayout(
      pendingPayout!.id,
      "REJECT",
      adminUser.id,
      { adminNotes: "Chave Pix inválida no banco emissor." }
    );

    expect(rejectedPayout.status).toBe("REJECTED");
    expect(rejectedPayout.adminNotes).toContain("Chave Pix inválida");

    // Saldo do afiliado deve ter voltado para R$ 60,00 (1000 + 5000 = 6000)
    const profileAfterReject = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    });
    expect(profileAfterReject?.balanceCents).toBe(6000);

    // CENÁRIO B: Nova solicitação e Aprovação com comprovante
    const newPayout = await AffiliateService.requestPayout(affiliateUser.id, 5000);
    expect(newPayout.status).toBe("PENDING");

    const approvedPayout = await AffiliateService.adminProcessPayout(
      newPayout.id,
      "APPROVE",
      adminUser.id,
      { proofUrl: "E12345678901234567890", adminNotes: "Pix liquidado com sucesso" }
    );

    expect(approvedPayout.status).toBe("PAID");
    expect(approvedPayout.proofUrl).toBe("E12345678901234567890");

    // Saldo sacado total do afiliado deve registrar os R$ 50,00
    const profileAfterApproval = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    });
    expect(profileAfterApproval?.withdrawnCents).toBe(5000);
    expect(profileAfterApproval?.balanceCents).toBe(1000);
  });

  it("6. Estorno de Pagamento (Refund) deve debitar atômico da comissão do afiliado", async () => {
    // Cria novo pedido e pagamento de R$ 200,00 (20.000 centavos)
    const orderToRefund = await prisma.order.create({
      data: {
        userId: referredUser.id,
        packageId: "pack-to-refund",
        amountCents: 20000,
        creditsGranted: 200,
      },
    });

    const paymentToRefund = await prisma.payment.create({
      data: {
        userId: referredUser.id,
        orderId: orderToRefund.id,
        amountCents: 20000,
        creditsGranted: 200,
        status: PaymentStatus.PENDING,
        gateway: "mercadopago",
        gatewayTxId: `tx_ref_${Date.now()}`,
      },
    });

    await PaymentLedgerService.confirmPayment(
      paymentToRefund.id,
      paymentToRefund.gatewayTxId,
      `idemp_ref_${Date.now()}`
    );

    // Comissão gerada: 15% de 20.000 = 3.000 centavos (R$ 30,00)
    const comm = await prisma.affiliateCommission.findUnique({
      where: { paymentId: paymentToRefund.id },
    });
    expect(comm?.status).toBe("APPROVED");
    expect(comm?.commissionAmountCents).toBe(3000);

    const balanceBeforeRefund = (await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    }))?.balanceCents || 0;

    // Dispara estorno de pagamento no PaymentLedgerService
    await PaymentLedgerService.refundPayment(paymentToRefund.id);

    // Comissão deve estar marcada como REFUNDED
    const commAfterRefund = await prisma.affiliateCommission.findUnique({
      where: { paymentId: paymentToRefund.id },
    });
    expect(commAfterRefund?.status).toBe("REFUNDED");

    // Saldo do afiliado deve ter sofrido o estorno exato de 3.000 centavos
    const balanceAfterRefund = (await prisma.affiliateProfile.findUnique({
      where: { id: affiliateProfile.id },
    }))?.balanceCents || 0;

    expect(balanceAfterRefund).toBe(balanceBeforeRefund - 3000);
  });
});
