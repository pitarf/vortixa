import prisma from "@/lib/prisma";
import { CreditService } from "./credit.service";
import { AIProviderFactory } from "./ai/ai-provider.factory";
import { FlowExecutionStatus, FlowNodeExecutionStatus } from "@prisma/client";

export class FlowExecutionError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string = "FLOW_EXECUTION_ERROR", statusCode: number = 400) {
    super(message);
    this.name = "FlowExecutionError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class CycleDetectedError extends FlowExecutionError {
  constructor(message: string = "Ciclo detectado no grafo de nós (CYCLE_DETECTED).") {
    super(message, "CYCLE_DETECTED", 400);
  }
}

export class IdempotencyConflictError extends FlowExecutionError {
  constructor(message: string = "A chave de idempotência fornecida já foi utilizada para outra execução.") {
    super(message, "IDEMPOTENCY_CONFLICT", 409);
  }
}

export class InsufficientCreditsError extends FlowExecutionError {
  constructor(message: string = "Saldo insuficiente de créditos para executar o fluxo completo.") {
    super(message, "INSUFFICIENT_CREDITS", 400);
  }
}

export interface DAGValidationResult {
  isValid: boolean;
  sortedNodeIds: string[];
  inDegrees: Map<string, number>;
  adjacencyList: Map<string, string[]>;
}

export class FlowExecutionService {
  /**
   * Valida se a topologia do grafo é um DAG acíclico determinístico utilizando o Algoritmo de Kahn.
   */
  static validateDAG(
    nodes: { id: string }[],
    connections: { sourceNodeId: string; targetNodeId: string }[]
  ): DAGValidationResult {
    const inDegrees = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    for (const node of nodes) {
      inDegrees.set(node.id, 0);
      adjacencyList.set(node.id, []);
    }

    for (const conn of connections) {
      if (!inDegrees.has(conn.targetNodeId) || !adjacencyList.has(conn.sourceNodeId)) {
        continue;
      }
      inDegrees.set(conn.targetNodeId, (inDegrees.get(conn.targetNodeId) || 0) + 1);
      adjacencyList.get(conn.sourceNodeId)!.push(conn.targetNodeId);
    }

    const queue: string[] = [];
    inDegrees.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const sortedNodeIds: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      sortedNodeIds.push(current);

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegrees.get(neighbor) || 0) - 1;
        inDegrees.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    const isValid = sortedNodeIds.length === nodes.length;

    return {
      isValid,
      sortedNodeIds,
      inDegrees,
      adjacencyList,
    };
  }

  /**
   * Calcula o custo total e individual de cada nó diretamente das tabelas de IA no servidor.
   * Ignora completamente qualquer valor informado pelo cliente.
   */
  static async calculateFlowCosts(nodes: Array<{ id: string; toolSlug?: string | null }>) {
    const nodeCosts = new Map<string, { cost: number; modelId?: string; toolId?: string; apiUnitCost?: number; technicalName?: string }>();
    let totalCreditCost = 0;

    for (const node of nodes) {
      if (node.toolSlug) {
        const tool = await prisma.aITool.findUnique({
          where: { slug: node.toolSlug },
          include: { model: true },
        });

        if (!tool || !tool.status || !tool.model.status) {
          throw new FlowExecutionError(`A ferramenta '${node.toolSlug}' está inativa ou não cadastrada.`);
        }

        const cost = tool.model.creditCost;
        nodeCosts.set(node.id, {
          cost,
          modelId: tool.model.id,
          toolId: tool.id,
          apiUnitCost: tool.model.apiUnitCost,
          technicalName: tool.model.technicalName,
        });
        totalCreditCost += cost;
      } else {
        nodeCosts.set(node.id, { cost: 0 });
      }
    }

    return { totalCreditCost, nodeCosts };
  }

  /**
   * Dispara a execução do fluxo com lock pessimista, reserva atômica de créditos e idempotência estrita.
   */
  static async executeFlow(
    userId: string,
    flowId: string,
    options: {
      idempotencyKey?: string;
      initialInputs?: Record<string, any>;
    } = {}
  ) {
    if (options.idempotencyKey) {
      const existing = await prisma.flowExecution.findUnique({
        where: { idempotencyKey: options.idempotencyKey },
        include: {
          nodeExecutions: {
            include: { flowNode: true },
          },
        },
      });

      if (existing) {
        if (existing.flowId === flowId && existing.userId === userId) {
          return { execution: existing, isIdempotentReplay: true };
        } else {
          throw new IdempotencyConflictError();
        }
      }
    }

    const flow = await prisma.flow.findFirst({
      where: { id: flowId, userId },
      include: {
        nodes: true,
        connections: true,
      },
    });

    if (!flow) {
      throw new FlowExecutionError("Fluxo não encontrado ou não pertence ao usuário autenticado.", "FLOW_NOT_FOUND", 404);
    }

    if (flow.nodes.length === 0) {
      throw new FlowExecutionError("O fluxo não possui nós para execução.");
    }

    const dagResult = this.validateDAG(flow.nodes, flow.connections);
    if (!dagResult.isValid) {
      throw new CycleDetectedError();
    }

    const { totalCreditCost, nodeCosts } = await this.calculateFlowCosts(flow.nodes);

    const execution = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { isUnlimited: true },
      });

      if (!user) {
        throw new FlowExecutionError("Usuário não encontrado.", "USER_NOT_FOUND", 404);
      }

      if (!user.isUnlimited && totalCreditCost > 0) {
        await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${userId} FOR UPDATE`;

        const balanceRecord = await tx.creditBalance.findUnique({
          where: { userId },
        });

        const currentBalance = balanceRecord?.balance || 0;
        if (currentBalance < totalCreditCost) {
          throw new InsufficientCreditsError();
        }

        await tx.creditBalance.update({
          where: { userId },
          data: { balance: currentBalance - totalCreditCost },
        });
      }

      const exec = await tx.flowExecution.create({
        data: {
          flowId,
          userId,
          status: "RUNNING",
          totalCreditCost,
          creditsReserved: totalCreditCost,
          creditsCharged: 0,
          creditsRefunded: 0,
          idempotencyKey: options.idempotencyKey || null,
          startedAt: new Date(),
        },
      });

      if (totalCreditCost > 0) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -totalCreditCost,
            type: "GENERATION_DEBIT",
            description: `Reserva de créditos para execução do Flow: ${flow.name} (${exec.id})`,
            flowExecutionId: exec.id,
          },
        });
      }

      const nodeExecutionsData = flow.nodes.map((node) => {
        const inDegree = dagResult.inDegrees.get(node.id) || 0;
        const nodeInfo = nodeCosts.get(node.id);
        return {
          flowExecutionId: exec.id,
          flowNodeId: node.id,
          status: (inDegree === 0 ? "QUEUED" : "IDLE") as FlowNodeExecutionStatus,
          creditCost: nodeInfo?.cost || 0,
          attempt: 1,
        };
      });

      await tx.flowNodeExecution.createMany({
        data: nodeExecutionsData,
      });

      return exec;
    });

    this.dispatchReadyNodes(execution.id, options.initialInputs).catch((err) => {
      console.error(`Erro assíncrono no disparo do DAG ${execution.id}:`, err);
    });

    const fullExecution = await prisma.flowExecution.findUnique({
      where: { id: execution.id },
      include: {
        nodeExecutions: {
          include: { flowNode: true },
        },
      },
    });

    return { execution: fullExecution!, isIdempotentReplay: false };
  }

  /**
   * Avalia a topologia e executa todos os nós cujas dependências foram satisfeitas.
   */
  static async dispatchReadyNodes(flowExecutionId: string, initialInputs: Record<string, any> = {}) {
    const execution = await prisma.flowExecution.findUnique({
      where: { id: flowExecutionId },
      include: {
        flow: {
          include: {
            nodes: true,
            connections: true,
          },
        },
        nodeExecutions: {
          include: {
            flowNode: true,
            aiJob: true,
          },
        },
      },
    });

    if (!execution || execution.status !== "RUNNING") {
      return;
    }

    const { flow, nodeExecutions } = execution;
    const completedNodeIds = new Set(
      nodeExecutions.filter((ne) => ne.status === "COMPLETED").map((ne) => ne.flowNodeId)
    );

    for (const node of flow.nodes) {
      const nodeExec = nodeExecutions.find((ne) => ne.flowNodeId === node.id);
      if (!nodeExec || (nodeExec.status !== "IDLE" && nodeExec.status !== "QUEUED")) {
        continue;
      }

      const incomingEdges = flow.connections.filter((c) => c.targetNodeId === node.id);
      const isReady = incomingEdges.length === 0 || incomingEdges.every((edge) => completedNodeIds.has(edge.sourceNodeId));

      if (isReady) {
        await this.executeSingleNode(execution, node, nodeExec, incomingEdges, initialInputs);
      }
    }
  }

  /**
   * Executa um nó individual resolvendo inputs de nós pais e acionando IA ou nós de transformação.
   */
  private static async executeSingleNode(
    execution: any,
    node: any,
    nodeExec: any,
    incomingEdges: any[],
    initialInputs: Record<string, any>
  ) {
    try {
      const resolvedInputs: Record<string, any> = {
        ...(typeof node.config === "object" && node.config !== null ? node.config : {}),
      };

      for (const edge of incomingEdges) {
        const parentExec = execution.nodeExecutions.find((ne: any) => ne.flowNodeId === edge.sourceNodeId);
        if (parentExec?.outputs && typeof parentExec.outputs === "object") {
          const parentOutputs = parentExec.outputs as Record<string, any>;
          const mappedValue = parentOutputs[edge.sourceHandle] ??
            parentOutputs.url ??
            parentOutputs.output_image ??
            parentOutputs.output_video ??
            parentOutputs.text;

          resolvedInputs[edge.targetHandle] = mappedValue;
        }
      }

      if (incomingEdges.length === 0 && initialInputs) {
        Object.assign(resolvedInputs, initialInputs);
      }

      if (!node.toolSlug) {
        const promptText = resolvedInputs.prompt || (node.config as any)?.prompt || "";
        const outputs = {
          text: promptText,
          output_text: promptText,
          ...resolvedInputs,
        };

        await prisma.flowNodeExecution.update({
          where: { id: nodeExec.id },
          data: {
            status: "COMPLETED",
            resolvedInputs,
            outputs,
            startedAt: new Date(),
            completedAt: new Date(),
          },
        });

        await this.dispatchReadyNodes(execution.id);
        return;
      }

      const tool = await prisma.aITool.findUnique({
        where: { slug: node.toolSlug },
        include: { model: true },
      });

      if (!tool) {
        throw new Error(`Ferramenta '${node.toolSlug}' não encontrada.`);
      }

      const aiJob = await prisma.aIJob.create({
        data: {
          userId: execution.userId,
          modelId: tool.model.id,
          toolId: tool.id,
          status: "PROCESSING",
          creditCost: nodeExec.creditCost,
          apiUnitCost: tool.model.apiUnitCost,
          billingUnit: tool.model.billingUnit || "GENERATION",
          billingQuantity: 1.0,
          providerCostUsd: tool.model.apiUnitCost,
          creditsReserved: nodeExec.creditCost,
          creditsCharged: 0,
        },
      });

      await prisma.aIJobInput.createMany({
        data: Object.entries(resolvedInputs).map(([key, value]) => ({
          jobId: aiJob.id,
          key,
          value: typeof value === "string" ? value : JSON.stringify(value),
        })),
      });

      await prisma.flowNodeExecution.update({
        where: { id: nodeExec.id },
        data: {
          status: "RUNNING",
          aiJobId: aiJob.id,
          resolvedInputs,
          startedAt: new Date(),
        },
      });

      const provider = AIProviderFactory.getProvider();
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3005";
      const webhookUrl = `${baseUrl}/api/webhooks/fal`;

      const result = await provider.submitJob({
        jobId: aiJob.id,
        modelTechnicalName: tool.model.technicalName,
        inputs: resolvedInputs,
        webhookUrl,
      });

      await prisma.aIJob.update({
        where: { id: aiJob.id },
        data: { providerJobId: result.providerJobId },
      });
    } catch (err: any) {
      console.error(`Falha na execução do nó ${node.id}:`, err);
      await this.handleNodeFailure(execution.id, nodeExec.id, err.message || "Erro desconhecido na execução do nó.");
    }
  }

  /**
   * Processa a conclusão de um AIJob associado a um FlowNodeExecution.
   */
  static async handleJobCompletion(aiJobId: string, outputData: { outputs?: any; outputUrls?: string[] }) {
    const nodeExec = await prisma.flowNodeExecution.findUnique({
      where: { aiJobId },
      include: {
        flowExecution: {
          include: {
            flow: {
              include: { nodes: true, connections: true },
            },
            nodeExecutions: true,
          },
        },
      },
    });

    if (!nodeExec || nodeExec.status === "COMPLETED") {
      return;
    }

    const firstUrl = outputData.outputUrls?.[0] || null;
    const outputs = {
      ...(outputData.outputs || {}),
      urls: outputData.outputUrls || [],
      url: firstUrl,
      output_image: firstUrl,
      output_video: firstUrl,
    };

    await prisma.$transaction([
      prisma.flowNodeExecution.update({
        where: { id: nodeExec.id },
        data: {
          status: "COMPLETED",
          outputs,
          completedAt: new Date(),
        },
      }),
      prisma.flowExecution.update({
        where: { id: nodeExec.flowExecutionId },
        data: {
          creditsCharged: { increment: nodeExec.creditCost },
        },
      }),
    ]);

    const remainingIncomplete = await prisma.flowNodeExecution.count({
      where: {
        flowExecutionId: nodeExec.flowExecutionId,
        status: { not: "COMPLETED" },
      },
    });

    if (remainingIncomplete === 0) {
      await prisma.flowExecution.update({
        where: { id: nodeExec.flowExecutionId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    } else {
      await this.dispatchReadyNodes(nodeExec.flowExecutionId);
    }
  }

  /**
   * Trata falha em um nó, cascateia cancelamento aos dependentes e estorna créditos não utilizados no Ledger.
   */
  static async handleJobFailure(aiJobId: string, errorMsg: string) {
    const nodeExec = await prisma.flowNodeExecution.findUnique({
      where: { aiJobId },
    });

    if (!nodeExec) return;
    await this.handleNodeFailure(nodeExec.flowExecutionId, nodeExec.id, errorMsg);
  }

  /**
   * Trata falha em nó com estorno atômico rigoroso e garantia da equação contábil:
   * creditsReserved = creditsCharged + creditsRefunded
   */
  static async handleNodeFailure(flowExecutionId: string, failedNodeExecId: string, errorMsg: string) {
    const execution = await prisma.flowExecution.findUnique({
      where: { id: flowExecutionId },
      include: {
        flow: {
          include: { nodes: true, connections: true },
        },
        nodeExecutions: true,
      },
    });

    if (!execution || execution.status === "COMPLETED" || execution.status === "FAILED") {
      return;
    }

    const failedNodeExec = execution.nodeExecutions.find((ne) => ne.id === failedNodeExecId);
    if (!failedNodeExec) return;

    const downstreamNodeIds = new Set<string>();
    const queue = [failedNodeExec.flowNodeId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const outgoing = execution.flow.connections.filter((c) => c.sourceNodeId === currentId);
      for (const edge of outgoing) {
        if (!downstreamNodeIds.has(edge.targetNodeId)) {
          downstreamNodeIds.add(edge.targetNodeId);
          queue.push(edge.targetNodeId);
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.flowNodeExecution.update({
        where: { id: failedNodeExecId },
        data: {
          status: "FAILED",
          error: errorMsg,
          completedAt: new Date(),
        },
      });

      const dependentExecutions = execution.nodeExecutions.filter(
        (ne) => downstreamNodeIds.has(ne.flowNodeId) && (ne.status === "IDLE" || ne.status === "QUEUED")
      );

      for (const dep of dependentExecutions) {
        await tx.flowNodeExecution.update({
          where: { id: dep.id },
          data: {
            status: "SKIPPED",
            error: "Execução cancelada devido a falha em nó predecessor.",
            completedAt: new Date(),
          },
        });
      }

      const unspentCredits =
        failedNodeExec.creditCost +
        dependentExecutions.reduce((acc, curr) => acc + curr.creditCost, 0);

      if (unspentCredits > 0) {
        await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${execution.userId} FOR UPDATE`;

        await tx.creditBalance.update({
          where: { userId: execution.userId },
          data: { balance: { increment: unspentCredits } },
        });

        await tx.creditTransaction.create({
          data: {
            userId: execution.userId,
            amount: unspentCredits,
            type: "GENERATION_REFUND",
            description: `Estorno atômico por falha em nó no Flow Execution: ${execution.id}`,
            flowExecutionId: execution.id,
          },
        });
      }

      const hasCompletedNodes = execution.nodeExecutions.some((ne) => ne.status === "COMPLETED");
      const finalStatus: FlowExecutionStatus = hasCompletedNodes ? "PARTIALLY_FAILED" : "FAILED";

      await tx.flowExecution.update({
        where: { id: execution.id },
        data: {
          status: finalStatus,
          creditsRefunded: { increment: unspentCredits },
          error: errorMsg,
          completedAt: new Date(),
        },
      });
    });
  }

  /**
   * Cancela uma execução em andamento com estorno atômico imediato de nós pendentes.
   */
  static async cancelExecution(userId: string, flowExecutionId: string) {
    const execution = await prisma.flowExecution.findFirst({
      where: { id: flowExecutionId, userId },
      include: {
        nodeExecutions: {
          include: { aiJob: true },
        },
      },
    });

    if (!execution) {
      throw new FlowExecutionError("Execução de fluxo não localizada.", "EXECUTION_NOT_FOUND", 404);
    }

    if (
      execution.status === "COMPLETED" ||
      execution.status === "FAILED" ||
      execution.status === "PARTIALLY_FAILED" ||
      execution.status === "CANCELLED"
    ) {
      return execution;
    }

    const provider = AIProviderFactory.getProvider();

    await prisma.$transaction(async (tx) => {
      let refundAmount = 0;

      for (const ne of execution.nodeExecutions) {
        if (ne.status === "RUNNING") {
          if (ne.aiJob?.providerJobId) {
            provider.cancelJob(ne.aiJob.providerJobId).catch(() => {});
          }
          await tx.flowNodeExecution.update({
            where: { id: ne.id },
            data: { status: "CANCELLED", completedAt: new Date() },
          });
          refundAmount += ne.creditCost;
        } else if (ne.status === "IDLE" || ne.status === "QUEUED") {
          await tx.flowNodeExecution.update({
            where: { id: ne.id },
            data: { status: "CANCELLED", completedAt: new Date() },
          });
          refundAmount += ne.creditCost;
        }
      }

      if (refundAmount > 0) {
        await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${userId} FOR UPDATE`;

        await tx.creditBalance.update({
          where: { userId },
          data: { balance: { increment: refundAmount } },
        });

        await tx.creditTransaction.create({
          data: {
            userId,
            amount: refundAmount,
            type: "GENERATION_REFUND",
            description: `Estorno por cancelamento manual do Flow Execution: ${execution.id}`,
            flowExecutionId: execution.id,
          },
        });
      }

      await tx.flowExecution.update({
        where: { id: execution.id },
        data: {
          status: "CANCELLED",
          creditsRefunded: { increment: refundAmount },
          completedAt: new Date(),
        },
      });
    });

    return await prisma.flowExecution.findUnique({
      where: { id: flowExecutionId },
      include: { nodeExecutions: true },
    });
  }
}
