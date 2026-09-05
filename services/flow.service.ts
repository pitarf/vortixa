import prisma from "@/lib/prisma";
import { FlowStatus } from "@prisma/client";

export class FlowError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string = "FLOW_ERROR", statusCode: number = 400) {
    super(message);
    this.name = "FlowError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class FlowNotFoundError extends FlowError {
  constructor(message: string = "Fluxo não encontrado ou acesso não autorizado.") {
    super(message, "FLOW_NOT_FOUND", 404);
  }
}

export class FlowValidationError extends FlowError {
  constructor(message: string) {
    super(message, "FLOW_VALIDATION_ERROR", 400);
  }
}

export interface CreateFlowInput {
  name: string;
  description?: string | null;
  viewport?: Record<string, any> | null;
  status?: FlowStatus;
}

export interface UpdateFlowInput {
  name?: string;
  description?: string | null;
  viewport?: Record<string, any> | null;
  status?: FlowStatus;
}

export interface ListFlowsParams {
  status?: FlowStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateNodeInput {
  nodeType: string;
  toolSlug?: string | null;
  title: string;
  positionX: number;
  positionY: number;
  config?: Record<string, any> | null;
}

export interface UpdateNodeInput {
  title?: string;
  positionX?: number;
  positionY?: number;
  config?: Record<string, any> | null;
  toolSlug?: string | null;
  nodeType?: string;
}

export interface CreateConnectionInput {
  sourceNodeId: string;
  sourceHandle: string;
  targetNodeId: string;
  targetHandle: string;
}

export class FlowService {
  /**
   * Cria um novo Flow associado ao usuário autenticado.
   */
  static async createFlow(userId: string, input: CreateFlowInput) {
    if (!input.name || input.name.trim().length === 0) {
      throw new FlowValidationError("O nome do fluxo é obrigatório.");
    }

    return await prisma.flow.create({
      data: {
        userId,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        viewport: input.viewport ?? undefined,
        status: input.status || "DRAFT",
      },
    });
  }

  /**
   * Lista fluxos do usuário autenticado com suporte a paginação e busca textual.
   */
  static async listFlows(userId: string, params: ListFlowsParams = {}) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
    };

    if (params.status) {
      where.status = params.status;
    }

    if (params.search && params.search.trim().length > 0) {
      const query = params.search.trim();
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const [flows, total] = await Promise.all([
      prisma.flow.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: {
              nodes: true,
              connections: true,
              executions: true,
            },
          },
        },
      }),
      prisma.flow.count({ where }),
    ]);

    return {
      flows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtém detalhes completos de um Flow garantindo ownership estrito do usuário.
   */
  static async getFlowById(userId: string, flowId: string) {
    const flow = await prisma.flow.findFirst({
      where: {
        id: flowId,
        userId,
      },
      include: {
        nodes: {
          orderBy: { createdAt: "asc" },
        },
        connections: {
          orderBy: { createdAt: "asc" },
        },
        executions: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!flow) {
      throw new FlowNotFoundError();
    }

    return flow;
  }

  /**
   * Atualiza dados de um Flow pertencente ao usuário.
   */
  static async updateFlow(userId: string, flowId: string, input: UpdateFlowInput) {
    const existing = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });

    if (!existing) {
      throw new FlowNotFoundError();
    }

    const updateData: any = {};
    if (input.name !== undefined) {
      if (!input.name || input.name.trim().length === 0) {
        throw new FlowValidationError("O nome do fluxo não pode ser vazio.");
      }
      updateData.name = input.name.trim();
    }
    if (input.description !== undefined) {
      updateData.description = input.description ? input.description.trim() : null;
    }
    if (input.viewport !== undefined) {
      updateData.viewport = input.viewport;
    }
    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    return await prisma.flow.update({
      where: { id: flowId },
      data: updateData,
    });
  }

  /**
   * Remove um Flow e todas as suas entidades associadas em cascata.
   */
  static async deleteFlow(userId: string, flowId: string) {
    const existing = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });

    if (!existing) {
      throw new FlowNotFoundError();
    }

    await prisma.flow.delete({
      where: { id: flowId },
    });

    return { success: true, message: "Flow excluído com sucesso." };
  }

  // =========================================================================
  // GERENCIAMENTO DE NÓS (NODES)
  // =========================================================================

  /**
   * Adiciona um nó ao Flow validando permissão e disponibilidade da ferramenta de IA.
   */
  static async createNode(userId: string, flowId: string, input: CreateNodeInput) {
    const flow = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });
    if (!flow) {
      throw new FlowNotFoundError();
    }

    if (input.toolSlug) {
      const tool = await prisma.aITool.findUnique({
        where: { slug: input.toolSlug },
        include: { model: true },
      });
      if (!tool || !tool.status || !tool.model.status) {
        throw new FlowValidationError("Ferramenta de IA vinculada é inválida ou está inativa.");
      }
    }

    return await prisma.flowNode.create({
      data: {
        flowId,
        nodeType: input.nodeType,
        toolSlug: input.toolSlug || null,
        title: input.title.trim(),
        positionX: input.positionX,
        positionY: input.positionY,
        config: input.config ?? undefined,
      },
    });
  }

  /**
   * Atualiza as configurações ou posição de um nó no Flow.
   */
  static async updateNode(userId: string, flowId: string, nodeId: string, input: UpdateNodeInput) {
    const flow = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });
    if (!flow) {
      throw new FlowNotFoundError();
    }

    const node = await prisma.flowNode.findFirst({
      where: { id: nodeId, flowId },
    });
    if (!node) {
      throw new FlowValidationError("Nó não encontrado no fluxo informado.");
    }

    if (input.toolSlug) {
      const tool = await prisma.aITool.findUnique({
        where: { slug: input.toolSlug },
        include: { model: true },
      });
      if (!tool || !tool.status || !tool.model.status) {
        throw new FlowValidationError("Ferramenta de IA vinculada é inválida ou está inativa.");
      }
    }

    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.positionX !== undefined) updateData.positionX = input.positionX;
    if (input.positionY !== undefined) updateData.positionY = input.positionY;
    if (input.config !== undefined) updateData.config = input.config;
    if (input.toolSlug !== undefined) updateData.toolSlug = input.toolSlug || null;
    if (input.nodeType !== undefined) updateData.nodeType = input.nodeType;

    return await prisma.flowNode.update({
      where: { id: nodeId },
      data: updateData,
    });
  }

  /**
   * Remove um nó do Flow e desconecta suas conexões em cascata.
   */
  static async deleteNode(userId: string, flowId: string, nodeId: string) {
    const flow = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });
    if (!flow) {
      throw new FlowNotFoundError();
    }

    const node = await prisma.flowNode.findFirst({
      where: { id: nodeId, flowId },
    });
    if (!node) {
      throw new FlowValidationError("Nó não localizado no fluxo.");
    }

    await prisma.flowNode.delete({
      where: { id: nodeId },
    });

    return { success: true, message: "Nó excluído com sucesso." };
  }

  // =========================================================================
  // GERENCIAMENTO DE CONEXÕES (CONNECTIONS)
  // =========================================================================

  /**
   * Cria uma conexão entre dois nós do mesmo Flow garantindo ausência de injeção cross-tenant.
   */
  static async createConnection(userId: string, flowId: string, input: CreateConnectionInput) {
    const flow = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });
    if (!flow) {
      throw new FlowNotFoundError();
    }

    if (input.sourceNodeId === input.targetNodeId) {
      throw new FlowValidationError("Um nó não pode ser conectado a si mesmo.");
    }

    const [sourceNode, targetNode] = await Promise.all([
      prisma.flowNode.findFirst({ where: { id: input.sourceNodeId, flowId } }),
      prisma.flowNode.findFirst({ where: { id: input.targetNodeId, flowId } }),
    ]);

    if (!sourceNode || !targetNode) {
      throw new FlowValidationError("Os nós de origem e destino devem pertencer ao mesmo fluxo.");
    }

    const existing = await prisma.flowConnection.findUnique({
      where: {
        flowId_sourceNodeId_sourceHandle_targetNodeId_targetHandle: {
          flowId,
          sourceNodeId: input.sourceNodeId,
          sourceHandle: input.sourceHandle,
          targetNodeId: input.targetNodeId,
          targetHandle: input.targetHandle,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return await prisma.flowConnection.create({
      data: {
        flowId,
        sourceNodeId: input.sourceNodeId,
        sourceHandle: input.sourceHandle,
        targetNodeId: input.targetNodeId,
        targetHandle: input.targetHandle,
      },
    });
  }

  /**
   * Remove uma conexão do Flow.
   */
  static async deleteConnection(userId: string, flowId: string, connectionId: string) {
    const flow = await prisma.flow.findFirst({
      where: { id: flowId, userId },
    });
    if (!flow) {
      throw new FlowNotFoundError();
    }

    const connection = await prisma.flowConnection.findFirst({
      where: { id: connectionId, flowId },
    });
    if (!connection) {
      throw new FlowValidationError("Conexão não localizada no fluxo.");
    }

    await prisma.flowConnection.delete({
      where: { id: connectionId },
    });

    return { success: true, message: "Conexão removida com sucesso." };
  }
}
