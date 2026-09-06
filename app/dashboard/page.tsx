import React from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";

import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardCreationCards } from "@/components/dashboard/DashboardCreationCards";
import {
  DashboardRecentProjects,
  ProjectItem,
} from "@/components/dashboard/DashboardRecentProjects";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let userBalance = 0;
  let isUnlimited = false;
  let projectsCount = 0;
  let assetsCount = 0;
  let consumedCredits = 0;
  let recentProjects: ProjectItem[] = [];

  if (userId) {
    try {
      userBalance = await CreditService.getBalance(userId);
      const userRecord = await prisma.user.findUnique({
        where: { id: userId },
        select: { isUnlimited: true },
      });
      isUnlimited = !!userRecord?.isUnlimited;

      // Contagem real de AIJobs concluídos e fluxos
      assetsCount = await prisma.aIJob.count({
        where: { userId, status: "COMPLETED" },
      });

      projectsCount = await prisma.flow.count({
        where: { userId },
      });

      // Cálculo de créditos consumidos (débitos)
      const debitTransactions = await prisma.creditTransaction.aggregate({
        where: {
          userId,
          amount: { lt: 0 },
        },
        _sum: {
          amount: true,
        },
      });
      consumedCredits = Math.abs(debitTransactions._sum.amount || 0);

      // Busca os últimos AIJobs concluídos
      const userJobs = await prisma.aIJob.findMany({
        where: { userId, status: "COMPLETED" },
        include: {
          tool: true,
          model: true,
          inputs: true,
          outputs: true,
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      });

      if (userJobs.length > 0) {
        recentProjects = userJobs.map((job) => {
          const promptInput = job.inputs.find((i) => i.key === "prompt");
          const firstOutput = job.outputs[0]?.fileUrl || "";
          const isVideo =
            firstOutput.endsWith(".mp4") ||
            job.model.technicalName.includes("video") ||
            job.model.technicalName.includes("motion");

          return {
            id: job.id,
            title: promptInput?.value
              ? promptInput.value.slice(0, 42) + "..."
              : `Projeto ${job.tool.name}`,
            model: job.model.name,
            duration: isVideo ? "0:08" : "4K",
            timeAgo: "há pouco",
            mediaType: isVideo ? "video" : "image",
            thumbnailUrl: firstOutput || "/media/landing/gallery/editorial_fashion.jpg",
            mediaUrl: firstOutput || "/media/landing/gallery/editorial_fashion.jpg",
          };
        });
      }
    } catch {
      // Fallback gracioso caso haja oscilação de banco
    }
  }

  // Se não houver projetos suficientes no banco, enriquecemos com os projetos cinematográficos demonstrativos
  if (recentProjects.length < 4) {
    const demoProjects: ProjectItem[] = [
      {
        id: "demo-1",
        title: "Cyberpunk Hypercar Widescreen",
        model: "FLUX.1 + Kling 1.5",
        duration: "0:08",
        timeAgo: "há 2 horas",
        mediaType: "video",
        thumbnailUrl: "/media/landing/gallery/hypercar_cyberpunk.jpg",
        mediaUrl: "/media/landing/videos/cinematic_hypercar.mp4",
      },
      {
        id: "demo-2",
        title: "Comercial de Perfume Volumétrico",
        model: "Kling AI 1.5 Pro",
        duration: "0:12",
        timeAgo: "há 5 horas",
        mediaType: "video",
        thumbnailUrl: "/media/landing/gallery/perfume_commercial.jpg",
        mediaUrl: "/media/landing/videos/commercial_perfume.mp4",
      },
      {
        id: "demo-3",
        title: "Retrato Editorial de Alta Definição",
        model: "FLUX.1 Schnell",
        duration: "4K UHD",
        timeAgo: "há 1 dia",
        mediaType: "image",
        thumbnailUrl: "/media/landing/gallery/editorial_fashion.jpg",
        mediaUrl: "/media/landing/gallery/editorial_fashion.jpg",
      },
      {
        id: "demo-4",
        title: "Street Dancer Motion Sync",
        model: "Motion Control + Kling",
        duration: "0:10",
        timeAgo: "há 2 dias",
        mediaType: "video",
        thumbnailUrl: "/media/landing/gallery/street_dancer.jpg",
        mediaUrl: "/media/landing/videos/motion_dancer.mp4",
      },
    ];

    recentProjects = [...recentProjects, ...demoProjects].slice(0, 4);
  }

  const userName = session?.user?.name || "Criador";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* 1. Hero Banner Cinematográfico */}
      <DashboardHero
        userName={userName}
        userBalance={userBalance}
        isUnlimited={isUnlimited}
        stats={{
          projectsCount,
          assetsCount,
          creditsAvailable: userBalance,
          uptime: "99.99%",
        }}
      />

      {/* 2. Grid dos 4 Cards Principais de Criação */}
      <DashboardCreationCards />

      {/* 3. Seção "Seus últimos projetos" */}
      <DashboardRecentProjects projects={recentProjects} />

      {/* 4. Grid Inferior com 3 Widgets de Suporte */}
      <DashboardWidgets
        userBalance={userBalance}
        consumedCredits={consumedCredits}
        assetsCount={assetsCount}
        isUnlimited={isUnlimited}
      />
    </div>
  );
}