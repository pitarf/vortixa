import React from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userBalance = 0;
  let isUnlimited = false;

  if (session?.user?.id) {
    try {
      userBalance = await CreditService.getBalance(session.user.id);
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isUnlimited: true },
      });
      isUnlimited = !!user?.isUnlimited;
    } catch {
      // Fallback gracioso caso banco esteja inicializando
    }
  }

  return (
    <DashboardShell
      user={session?.user || null}
      userBalance={userBalance}
      isUnlimited={isUnlimited}
    >
      {children}
    </DashboardShell>
  );
}