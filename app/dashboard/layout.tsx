import React from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SetPasswordModal } from "@/components/auth/SetPasswordModal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userBalance = 0;
  let isUnlimited = false;
  let hasPassword = true;

  let planName = "Sem Plano (Gratuito)";

  if (session?.user?.id) {
    try {
      userBalance = await CreditService.getBalance(session.user.id);

      // Sincronização automática para o Administrador Principal
      if (session.user.email?.toLowerCase() === "rfpita.ti@gmail.com") {
        await prisma.user.updateMany({
          where: { email: "rfpita.ti@gmail.com" },
          data: { role: "ADMIN", isUnlimited: true },
        });
        isUnlimited = true;
      } else {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { isUnlimited: true, passwordHash: true },
        });
        isUnlimited = !!user?.isUnlimited;
        hasPassword = !!user?.passwordHash;
      }

      // Se for o admin, checa também se tem senha cadastrada
      if (session.user.email?.toLowerCase() === "rfpita.ti@gmail.com") {
        const adminUser = await prisma.user.findUnique({
          where: { email: "rfpita.ti@gmail.com" },
          select: { passwordHash: true },
        });
        hasPassword = !!adminUser?.passwordHash;
      }

      if (isUnlimited) {
        planName = "Acesso Ilimitado";
      } else {
        // Verifica se o usuário já fez alguma compra de pacote
        const paidOrder = await prisma.order.findFirst({
          where: { userId: session.user.id, status: "PAID" },
          orderBy: { createdAt: "desc" },
        });

        if (paidOrder) {
          if (paidOrder.packageId.includes("1000")) {
            planName = "Plano Criador Pro";
          } else if (paidOrder.packageId.includes("500")) {
            planName = "Plano Profissional";
          } else {
            planName = "Plano Iniciante";
          }
        } else {
          planName = "Sem Plano (10 cr bônus)";
        }
      }
    } catch {
      // Fallback gracioso caso banco esteja inicializando
    }
  }

  return (
    <>
      {!hasPassword && <SetPasswordModal />}
      <DashboardShell
        user={session?.user || null}
        userBalance={userBalance}
        isUnlimited={isUnlimited}
        planName={planName}
      >
        {children}
      </DashboardShell>
    </>
  );
}