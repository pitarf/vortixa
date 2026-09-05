import { create } from "zustand";
import {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import {
  Flow,
  FlowNode,
  FlowConnection,
  FlowExecution,
  FlowNodeExecution,
  FlowNodeType,
  FlowNodeConfig,
  FlowStatus,
} from "@/types/flow";
import { toast } from "sonner";

export interface FlowNodeData extends Record<string, unknown> {
  nodeId: string;
  nodeType: FlowNodeType;
  toolSlug?: string | null;
  title: string;
  config: FlowNodeConfig;
  status?: FlowNodeExecution["status"];
  creditCost?: number;
  outputs?: Record<string, unknown> | null;
  resolvedInputs?: Record<string, unknown> | null;
  error?: string | null;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
}

export type CustomFlowNode = Node<FlowNodeData>;

export interface HistoryState {
  past: Array<{ nodes: CustomFlowNode[]; edges: Edge[] }>;
  future: Array<{ nodes: CustomFlowNode[]; edges: Edge[] }>;
}

export interface FlowStoreState {
  // Metadados do Flow
  flowId: string | null;
  flowName: string;
  flowDescription: string;
  status: FlowStatus;
  viewport: { x: number; y: number; zoom: number };
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;

  // React Flow State
  nodes: CustomFlowNode[];
  edges: Edge[];
  selectedNodeId: string | null;

  // UI Panels / Modais
  inspectorOpen: boolean;
  nodePickerOpen: boolean;
  nodePickerPosition: { x: number; y: number } | null;
  aiBuilderOpen: boolean;
  runModalOpen: boolean;
  lightboxMedia: { url: string; type: "image" | "video"; title?: string; prompt?: string } | null;

  // Histórico Undo / Redo
  history: HistoryState;

  // Execução & Créditos
  isExecuting: boolean;
  activeExecutionId: string | null;
  activeExecution: FlowExecution | null;
  userBalance: number;
  creditMode: "LIMITED" | "UNLIMITED";
  availableTools: any[];

  // Ações de Metadados
  setFlowMetadata: (data: { id?: string; name?: string; description?: string; status?: FlowStatus }) => void;
  setFlowName: (name: string) => void;
  setFlowDescription: (desc: string) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;

  // Ações React Flow
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: CustomFlowNode[]) => void;
  setEdges: (edges: Edge[]) => void;

  // Operações de Nós
  addNode: (
    nodeType: FlowNodeType,
    position?: { x: number; y: number },
    initialConfig?: Partial<FlowNodeConfig>,
    customTitle?: string
  ) => string;
  updateNodeConfig: (nodeId: string, config: Partial<FlowNodeConfig>) => void;
  updateNodeTitle: (nodeId: string, title: string) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;

  // Seleção e Modais
  setSelectedNodeId: (id: string | null) => void;
  setInspectorOpen: (open: boolean) => void;
  setNodePickerOpen: (open: boolean, pos?: { x: number; y: number } | null) => void;
  setAiBuilderOpen: (open: boolean) => void;
  setRunModalOpen: (open: boolean) => void;
  setLightboxMedia: (media: { url: string; type: "image" | "video"; title?: string; prompt?: string } | null) => void;

  // Histórico
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Backend Sync & Persistência
  loadFlow: (flowId: string) => Promise<void>;
  saveFlow: () => Promise<boolean>;
  refreshUserBalance: () => Promise<void>;

  // Execução de Flow
  executeFlow: () => Promise<FlowExecution | null>;
  cancelExecution: () => Promise<void>;
  pollExecutionStatus: (executionId: string) => Promise<void>;
  resetExecutionState: () => void;
  applyAITemplate: (
    templateNodes: Array<{ nodeType: FlowNodeType; title: string; config: any; position: { x: number; y: number } }>,
    templateEdges: Array<{ sourceIndex: number; sourceHandle: string; targetIndex: number; targetHandle: string }>
  ) => void;
}

const DEFAULT_METADATA: Record<
  FlowNodeType,
  { title: string; toolSlug: string | null; defaultCreditCost: number; defaultInputs: Record<string, any> }
> = {
  prompt: {
    title: "Prompt Criativo",
    toolSlug: null,
    defaultCreditCost: 0,
    defaultInputs: { prompt: "", stylePreset: "cinematic" },
  },
  image: {
    title: "FLUX Imagem",
    toolSlug: "gerador-imagem",
    defaultCreditCost: 1,
    defaultInputs: { aspectRatio: "16:9", numInferenceSteps: 4, guidanceScale: 7.5, outputFormat: "jpeg" },
  },
  video: {
    title: "Kling Vídeo",
    toolSlug: "imagem-video",
    defaultCreditCost: 10,
    defaultInputs: { duration: 5, aspectRatio: "16:9", motionStrength: 5, cameraMovement: "static" },
  },
  motion: {
    title: "Motion Control",
    toolSlug: "motion-control",
    defaultCreditCost: 15,
    defaultInputs: { strength: 0.8, preserveFace: true },
  },
  lipsync: {
    title: "Lip Sync",
    toolSlug: "lip-sync",
    defaultCreditCost: 8,
    defaultInputs: { syncModel: "sync-1.5", faceTracking: true },
  },
  upscale: {
    title: "Creative Upscale 4K",
    toolSlug: "upscale",
    defaultCreditCost: 5,
    defaultInputs: { scaleFactor: 2, targetResolution: "4k", denoiseStrength: 0.3 },
  },
  audio: {
    title: "Voz & Áudio",
    toolSlug: null,
    defaultCreditCost: 0,
    defaultInputs: { ttsText: "", language: "pt-BR", voiceId: "standard" },
  },
  export: {
    title: "Exportar Mídia",
    toolSlug: null,
    defaultCreditCost: 0,
    defaultInputs: { autoSaveToLibrary: true, downloadFormat: "mp4" },
  },
  custom: {
    title: "Nó Customizado",
    toolSlug: null,
    defaultCreditCost: 0,
    defaultInputs: {},
  },
};

export const useFlowStore = create<FlowStoreState>((set, get) => ({
  flowId: null,
  flowName: "Novo Fluxo de Criação",
  flowDescription: "",
  status: "DRAFT",
  viewport: { x: 0, y: 0, zoom: 1 },
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,

  nodes: [],
  edges: [],
  selectedNodeId: null,

  inspectorOpen: false,
  nodePickerOpen: false,
  nodePickerPosition: null,
  aiBuilderOpen: false,
  runModalOpen: false,
  lightboxMedia: null,

  history: { past: [], future: [] },

  isExecuting: false,
  activeExecutionId: null,
  activeExecution: null,
  userBalance: 0,
  creditMode: "LIMITED",
  availableTools: [],

  setFlowMetadata: (data) =>
    set((state) => ({
      flowId: data.id !== undefined ? data.id : state.flowId,
      flowName: data.name !== undefined ? data.name : state.flowName,
      flowDescription: data.description !== undefined ? data.description : state.flowDescription,
      status: data.status !== undefined ? data.status : state.status,
      isDirty: true,
    })),

  setFlowName: (name) => set({ flowName: name, isDirty: true }),
  setFlowDescription: (desc) => set({ flowDescription: desc, isDirty: true }),
  setViewport: (viewport) => set({ viewport, isDirty: true }),

  takeSnapshot: () => {
    const { nodes, edges, history } = get();
    const newPast = [...history.past, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(
      -25
    );
    set({ history: { past: newPast, future: [] } });
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    const newFuture = [{ nodes, edges }, ...history.future];
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: { past: newPast, future: newFuture },
      isDirty: true,
    });
  },

  redo: () => {
    const { history, nodes, edges } = get();
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    const newPast = [...history.past, { nodes, edges }];
    set({
      nodes: next.nodes,
      edges: next.edges,
      history: { past: newPast, future: newFuture },
      isDirty: true,
    });
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  onNodesChange: (changes) => {
    const isMajorChange = changes.some((c) => c.type === "remove" || (c.type === "position" && c.dragging === false));
    if (isMajorChange) {
      get().takeSnapshot();
    }
    set({
      nodes: applyNodeChanges(changes, get().nodes) as CustomFlowNode[],
      isDirty: true,
    });
  },

  onEdgesChange: (changes) => {
    const isRemoval = changes.some((c) => c.type === "remove");
    if (isRemoval) {
      get().takeSnapshot();
    }
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isDirty: true,
    });
  },

  onConnect: (connection) => {
    get().takeSnapshot();
    const customEdge: Edge = {
      ...connection,
      id: `edge-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
      type: "custom",
      animated: false,
    };
    set({
      edges: addEdge(customEdge, get().edges),
      isDirty: true,
    });
  },

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  addNode: (nodeType, position, initialConfig = {}, customTitle) => {
    get().takeSnapshot();
    const id = `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const metadata = DEFAULT_METADATA[nodeType] || DEFAULT_METADATA.custom;
    const fallbackPosition = position || {
      x: 200 + (get().nodes.length % 5) * 40,
      y: 150 + (get().nodes.length % 5) * 40,
    };

    const newNode: CustomFlowNode = {
      id,
      type: nodeType,
      position: fallbackPosition,
      data: {
        nodeId: id,
        nodeType,
        toolSlug: metadata.toolSlug,
        title: customTitle || metadata.title,
        config: { ...metadata.defaultInputs, ...initialConfig },
        status: "IDLE",
        creditCost: metadata.defaultCreditCost,
        outputs: null,
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: id,
      inspectorOpen: true,
      isDirty: true,
    }));

    return id;
  },

  updateNodeConfig: (nodeId, configUpdates) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...node.data.config,
              ...configUpdates,
            },
          },
        };
      }),
      isDirty: true,
    }));
  },

  updateNodeTitle: (nodeId, title) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        return {
          ...node,
          data: {
            ...node.data,
            title,
          },
        };
      }),
      isDirty: true,
    }));
  },

  deleteNode: (nodeId) => {
    get().takeSnapshot();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      inspectorOpen: state.selectedNodeId === nodeId ? false : state.inspectorOpen,
      isDirty: true,
    }));
    toast.info("Nó removido do fluxo.");
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;
    get().takeSnapshot();
    const newId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clonedNode: CustomFlowNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: newId,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
      data: {
        ...JSON.parse(JSON.stringify(node.data)),
        nodeId: newId,
        title: `${node.data.title} (Cópia)`,
        status: "IDLE",
        outputs: null,
        error: null,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, clonedNode],
      selectedNodeId: newId,
      isDirty: true,
    }));
    toast.success("Nó duplicado com sucesso!");
  },

  setSelectedNodeId: (id) => {
    set({
      selectedNodeId: id,
      inspectorOpen: id !== null,
    });
  },

  setInspectorOpen: (open) => set({ inspectorOpen: open }),
  setNodePickerOpen: (open, position = null) => set({ nodePickerOpen: open, nodePickerPosition: position }),
  setAiBuilderOpen: (open) => set({ aiBuilderOpen: open }),
  setRunModalOpen: (open) => set({ runModalOpen: open }),
  setLightboxMedia: (media) => set({ lightboxMedia: media }),

  refreshUserBalance: async () => {
    try {
      const res = await fetch("/api/tools/config");
      if (res.ok) {
        const data = await res.json();
        set({
          userBalance: data.balance || 0,
          creditMode: data.creditMode || "LIMITED",
          availableTools: data.tools || [],
        });
      }
    } catch (err) {
      console.error("Falha ao carregar saldo e ferramentas:", err);
    }
  },

  loadFlow: async (flowId: string) => {
    try {
      const res = await fetch(`/api/flows/${flowId}`);
      if (!res.ok) {
        throw new Error("Não foi possível carregar os dados do fluxo.");
      }
      const flow: Flow = await res.json();

      const flowNodes: CustomFlowNode[] = (flow.nodes || []).map((n) => {
        const latestExec = flow.executions?.[0]?.nodeExecutions?.find((ne) => ne.flowNodeId === n.id);
        return {
          id: n.id,
          type: n.nodeType,
          position: { x: n.positionX, y: n.positionY },
          data: {
            nodeId: n.id,
            nodeType: n.nodeType,
            toolSlug: n.toolSlug,
            title: n.title,
            config: n.config || {},
            status: latestExec?.status || "IDLE",
            creditCost: latestExec?.creditCost || DEFAULT_METADATA[n.nodeType]?.defaultCreditCost || 0,
            outputs: latestExec?.outputs || null,
            resolvedInputs: latestExec?.resolvedInputs || null,
            error: latestExec?.error || null,
          },
        };
      });

      const flowEdges: Edge[] = (flow.connections || []).map((c) => ({
        id: c.id,
        source: c.sourceNodeId,
        sourceHandle: c.sourceHandle,
        target: c.targetNodeId,
        targetHandle: c.targetHandle,
        type: "custom",
      }));

      set({
        flowId: flow.id,
        flowName: flow.name,
        flowDescription: flow.description || "",
        status: flow.status,
        viewport: flow.viewport || { x: 0, y: 0, zoom: 1 },
        nodes: flowNodes,
        edges: flowEdges,
        history: { past: [], future: [] },
        isDirty: false,
        lastSavedAt: new Date(flow.updatedAt),
      });

      await get().refreshUserBalance();
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar fluxo.");
      throw err;
    }
  },

  saveFlow: async () => {
    const { flowId, flowName, flowDescription, status, viewport, isSaving } = get();
    if (!flowId || isSaving) return false;

    set({ isSaving: true });
    try {
      const flowRes = await fetch(`/api/flows/${flowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: flowName,
          description: flowDescription,
          status,
          viewport,
        }),
      });

      if (!flowRes.ok) {
        const errorData = await flowRes.json();
        throw new Error(errorData.error || "Falha ao salvar metadados do fluxo.");
      }

      set({
        isSaving: false,
        isDirty: false,
        lastSavedAt: new Date(),
      });

      toast.success("Fluxo salvo com sucesso!");
      return true;
    } catch (err: any) {
      set({ isSaving: false });
      toast.error(err.message || "Erro ao salvar alterações no servidor.");
      return false;
    }
  },

  executeFlow: async () => {
    const { flowId, isExecuting } = get();
    if (!flowId || isExecuting) return null;

    set({ isExecuting: true });
    try {
      const res = await fetch(`/api/flows/${flowId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha ao iniciar execução do fluxo.");
      }

      set({
        activeExecutionId: data.id,
        activeExecution: data,
        runModalOpen: false,
      });

      toast.success("Execução iniciada com sucesso!");
      if (data.nodeExecutions) {
        set((state) => ({
          nodes: state.nodes.map((n) => {
            const ne = data.nodeExecutions.find((item: any) => item.flowNodeId === n.id);
            if (!ne) return n;
            return {
              ...n,
              data: {
                ...n.data,
                status: ne.status,
                creditCost: ne.creditCost,
              },
            };
          }),
        }));
      }

      get().pollExecutionStatus(data.id);
      return data;
    } catch (err: any) {
      set({ isExecuting: false });
      toast.error(err.message || "Falha ao disparar execução.");
      return null;
    }
  },

  cancelExecution: async () => {
    const { flowId, isExecuting } = get();
    if (!flowId || !isExecuting) return;

    try {
      const res = await fetch(`/api/flows/${flowId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowExecutionId: get().activeExecutionId }),
      });
      if (res.ok) {
        toast.info("Execução cancelada e créditos pendentes estornados.");
        set({ isExecuting: false });
        await get().refreshUserBalance();
      }
    } catch (err) {
      toast.error("Erro ao cancelar execução.");
    }
  },

  pollExecutionStatus: async (executionId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/flows/executions/${executionId}`);
        if (!res.ok) {
          clearInterval(interval);
          set({ isExecuting: false });
          return;
        }

        const execution: FlowExecution = await res.json();
        set({ activeExecution: execution });

        if (execution.nodeExecutions) {
          set((state) => ({
            nodes: state.nodes.map((node) => {
              const ne = execution.nodeExecutions?.find((item) => item.flowNodeId === node.id);
              if (!ne) return node;
              return {
                ...node,
                data: {
                  ...node.data,
                  status: ne.status,
                  outputs: ne.outputs,
                  resolvedInputs: ne.resolvedInputs,
                  error: ne.error,
                  completedAt: ne.completedAt,
                },
              };
            }),
          }));
        }

        if (
          execution.status === "COMPLETED" ||
          execution.status === "FAILED" ||
          execution.status === "PARTIALLY_FAILED" ||
          execution.status === "CANCELLED"
        ) {
          clearInterval(interval);
          set({ isExecuting: false });
          await get().refreshUserBalance();

          if (execution.status === "COMPLETED") {
            toast.success("✨ Execução do Flow concluída com sucesso!");
          } else if (execution.status === "PARTIALLY_FAILED") {
            toast.warning("Execução finalizada com nós incompletos.");
          } else if (execution.status === "FAILED") {
            toast.error(`Falha na execução: ${execution.error || "Erro no processamento de nós."}`);
          }
        }
      } catch (e) {
        console.error("Erro no polling de execução:", e);
        clearInterval(interval);
        set({ isExecuting: false });
      }
    }, 2500);
  },

  resetExecutionState: () => {
    set((state) => ({
      isExecuting: false,
      activeExecutionId: null,
      activeExecution: null,
      nodes: state.nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "IDLE", error: null },
      })),
    }));
  },

  applyAITemplate: (templateNodes, templateEdges) => {
    get().takeSnapshot();
    const createdNodeIds: string[] = [];

    const newNodes: CustomFlowNode[] = templateNodes.map((item, idx) => {
      const id = `node_ai_${Date.now()}_${idx}`;
      createdNodeIds.push(id);
      const meta = DEFAULT_METADATA[item.nodeType] || DEFAULT_METADATA.custom;
      return {
        id,
        type: item.nodeType,
        position: item.position,
        data: {
          nodeId: id,
          nodeType: item.nodeType,
          toolSlug: meta.toolSlug,
          title: item.title || meta.title,
          config: { ...meta.defaultInputs, ...item.config },
          status: "IDLE",
          creditCost: meta.defaultCreditCost,
          outputs: null,
        },
      };
    });

    const newEdges: Edge[] = templateEdges.map((e, idx) => ({
      id: `edge_ai_${Date.now()}_${idx}`,
      source: createdNodeIds[e.sourceIndex],
      sourceHandle: e.sourceHandle,
      target: createdNodeIds[e.targetIndex],
      targetHandle: e.targetHandle,
      type: "custom",
    }));

    set({
      nodes: newNodes,
      edges: newEdges,
      isDirty: true,
      aiBuilderOpen: false,
    });

    toast.success("✦ Pipeline gerado pela IA inserido no Canvas!");
  },
}));
