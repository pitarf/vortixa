import { z } from "zod";

// ============================================================================
// 1. ENUMS E STATUS (ESPELHADOS DO PRISMA SCHEMA)
// ============================================================================

export type FlowStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type FlowExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "PARTIALLY_FAILED"
  | "FAILED"
  | "CANCELLED";

export type FlowNodeExecutionStatus =
  | "IDLE"
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "SKIPPED"
  | "CANCELLED";

export type FlowNodeType =
  | "prompt"
  | "image"
  | "video"
  | "motion"
  | "lipsync"
  | "upscale"
  | "audio"
  | "export"
  | "custom";

export type FlowHandleType = "text" | "image" | "video" | "audio" | "motion" | "any";

export type FlowHandlePosition = "top" | "bottom" | "left" | "right";

// ============================================================================
// 2. DESIGN SYSTEM V2 & VISUAL HANDLE TOKENS
// ============================================================================

export const FLOW_HANDLE_COLORS: Record<FlowHandleType, { hex: string; name: string; bgClass: string; borderClass: string }> = {
  text: {
    hex: "#8B5CF6",
    name: "Roxo Violeta",
    bgClass: "bg-purple-500",
    borderClass: "border-purple-400",
  },
  image: {
    hex: "#06B6D4",
    name: "Ciano Elétrico",
    bgClass: "bg-cyan-500",
    borderClass: "border-cyan-400",
  },
  video: {
    hex: "#10B981",
    name: "Esmeralda Cinemático",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-400",
  },
  audio: {
    hex: "#F59E0B",
    name: "Âmbar Vibrante",
    bgClass: "bg-amber-500",
    borderClass: "border-amber-400",
  },
  motion: {
    hex: "#EC4899",
    name: "Rosa Neon",
    bgClass: "bg-pink-500",
    borderClass: "border-pink-400",
  },
  any: {
    hex: "#94A3B8",
    name: "Slate Neutro",
    bgClass: "bg-slate-400",
    borderClass: "border-slate-300",
  },
};

export interface FlowHandleDefinition {
  id: string;
  type: FlowHandleType;
  label: string;
  description?: string;
  required?: boolean;
  position?: FlowHandlePosition;
  maxConnections?: number;
}

export const NODE_HANDLES_REGISTRY: Record<
  FlowNodeType,
  { inputs: FlowHandleDefinition[]; outputs: FlowHandleDefinition[] }
> = {
  prompt: {
    inputs: [],
    outputs: [
      { id: "output_text", type: "text", label: "Texto / Prompt", position: "right" },
    ],
  },
  image: {
    inputs: [
      { id: "input_prompt", type: "text", label: "Prompt", required: false, position: "left" },
    ],
    outputs: [
      { id: "output_image", type: "image", label: "Imagem Gerada", position: "right" },
    ],
  },
  video: {
    inputs: [
      { id: "input_image", type: "image", label: "Imagem Fonte", required: true, position: "left" },
      { id: "input_prompt", type: "text", label: "Prompt / Movimento", required: false, position: "left" },
    ],
    outputs: [
      { id: "output_video", type: "video", label: "Vídeo Gerado", position: "right" },
    ],
  },
  motion: {
    inputs: [
      { id: "input_image", type: "image", label: "Personagem", required: true, position: "left" },
      { id: "input_motion", type: "video", label: "Vídeo de Referência", required: true, position: "left" },
      { id: "input_prompt", type: "text", label: "Prompt Adicional", required: false, position: "left" },
    ],
    outputs: [
      { id: "output_video", type: "video", label: "Vídeo Animado", position: "right" },
    ],
  },
  lipsync: {
    inputs: [
      { id: "input_video", type: "video", label: "Vídeo ou Imagem", required: true, position: "left" },
      { id: "input_audio", type: "audio", label: "Áudio / Voz", required: true, position: "left" },
    ],
    outputs: [
      { id: "output_video", type: "video", label: "Vídeo Sincronizado", position: "right" },
    ],
  },
  upscale: {
    inputs: [
      { id: "input_video", type: "video", label: "Vídeo Original", required: true, position: "left" },
    ],
    outputs: [
      { id: "output_video", type: "video", label: "Vídeo 4K/HD", position: "right" },
    ],
  },
  audio: {
    inputs: [],
    outputs: [
      { id: "output_audio", type: "audio", label: "Áudio / Voz", position: "right" },
    ],
  },
  export: {
    inputs: [
      { id: "input_media", type: "any", label: "Mídia Final", required: true, position: "left" },
    ],
    outputs: [],
  },
  custom: {
    inputs: [
      { id: "input_generic", type: "any", label: "Entrada", position: "left" },
    ],
    outputs: [
      { id: "output_generic", type: "any", label: "Saída", position: "right" },
    ],
  },
};

// ============================================================================
// 3. CONFIGURAÇÕES PARAMÉTRICAS DE NÓS (INFERENCE PARAMS)
// ============================================================================

export interface PromptNodeConfig {
  prompt: string;
  negativePrompt?: string;
  stylePreset?: string;
}

export interface ImageNodeConfig {
  prompt?: string;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9";
  numInferenceSteps?: number;
  guidanceScale?: number;
  seed?: number;
  outputFormat?: "jpeg" | "png" | "webp";
}

export interface VideoNodeConfig {
  prompt?: string;
  duration?: 5 | 10;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  cfgScale?: number;
  motionStrength?: number;
  cameraMovement?: "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "orbit" | "static";
  seed?: number;
}

export interface MotionControlNodeConfig {
  characterImageUrl?: string;
  motionVideoUrl?: string;
  prompt?: string;
  strength?: number;
  preserveFace?: boolean;
}

export interface LipSyncNodeConfig {
  videoUrl?: string;
  audioUrl?: string;
  syncModel?: "sync-1.5" | "wav2lip" | "expressive";
  faceTracking?: boolean;
}

export interface UpscaleNodeConfig {
  videoUrl?: string;
  scaleFactor?: 2 | 4;
  targetResolution?: "1080p" | "2k" | "4k";
  denoiseStrength?: number;
}

export interface AudioNodeConfig {
  audioUrl?: string;
  ttsText?: string;
  voiceId?: string;
  language?: string;
}

export interface ExportNodeConfig {
  autoSaveToLibrary?: boolean;
  downloadFormat?: "mp4" | "png" | "webm";
  fileNameTemplate?: string;
}

export type GenericNodeConfig = Record<string, unknown>;

export type FlowNodeConfig =
  | PromptNodeConfig
  | ImageNodeConfig
  | VideoNodeConfig
  | MotionControlNodeConfig
  | LipSyncNodeConfig
  | UpscaleNodeConfig
  | AudioNodeConfig
  | ExportNodeConfig
  | GenericNodeConfig;

// ============================================================================
// 4. ENTIDADES DE DOMÍNIO (PRISMA + FRONTEND)
// ============================================================================

export interface FlowViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface FlowNode {
  id: string;
  flowId: string;
  nodeType: FlowNodeType;
  toolSlug?: string | null;
  title: string;
  positionX: number;
  positionY: number;
  config: FlowNodeConfig;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FlowConnection {
  id: string;
  flowId: string;
  sourceNodeId: string;
  sourceHandle: string;
  targetNodeId: string;
  targetHandle: string;
  createdAt: Date | string;
}

export interface FlowNodeExecution {
  id: string;
  flowExecutionId: string;
  flowNodeId: string;
  aiJobId?: string | null;
  status: FlowNodeExecutionStatus;
  creditCost: number;
  attempt: number;
  resolvedInputs?: Record<string, unknown> | null;
  outputs?: Record<string, unknown> | null;
  error?: string | null;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FlowExecution {
  id: string;
  flowId: string;
  userId: string;
  status: FlowExecutionStatus;
  totalCreditCost: number;
  creditsReserved: number;
  creditsCharged: number;
  creditsRefunded: number;
  idempotencyKey?: string | null;
  error?: string | null;
  startedAt?: Date | string | null;
  completedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  nodeExecutions?: FlowNodeExecution[];
}

export interface Flow {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  viewport?: FlowViewport | null;
  status: FlowStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  nodes?: FlowNode[];
  connections?: FlowConnection[];
  executions?: FlowExecution[];
  _count?: {
    nodes?: number;
    connections?: number;
    executions?: number;
  };
}

// ============================================================================
// 5. SCHEMAS ZOD DE VALIDAÇÃO
// ============================================================================

export const flowHandleTypeSchema = z.enum(["text", "image", "video", "audio", "motion", "any"]);

export const flowNodeTypeSchema = z.enum([
  "prompt",
  "image",
  "video",
  "motion",
  "lipsync",
  "upscale",
  "audio",
  "export",
  "custom",
]);

export const flowStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const flowExecutionStatusSchema = z.enum([
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "PARTIALLY_FAILED",
  "FAILED",
  "CANCELLED",
]);

export const flowNodeExecutionStatusSchema = z.enum([
  "IDLE",
  "QUEUED",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "SKIPPED",
  "CANCELLED",
]);

export const flowViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number().min(0.1).max(2),
});

export const promptNodeConfigSchema = z.object({
  prompt: z.string().min(1, "O prompt é obrigatório.").max(10000),
  negativePrompt: z.string().max(2000).optional(),
  stylePreset: z.string().optional(),
});

export const imageNodeConfigSchema = z.object({
  prompt: z.string().max(10000).optional(),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"]).default("1:1"),
  numInferenceSteps: z.number().int().min(1).max(100).optional(),
  guidanceScale: z.number().min(1).max(20).optional(),
  seed: z.number().int().optional(),
  outputFormat: z.enum(["jpeg", "png", "webp"]).default("jpeg"),
});

export const videoNodeConfigSchema = z.object({
  prompt: z.string().max(10000).optional(),
  duration: z.union([z.literal(5), z.literal(10)]).default(5),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
  cfgScale: z.number().min(0).max(1).optional(),
  motionStrength: z.number().min(1).max(10).optional(),
  cameraMovement: z.enum(["zoom_in", "zoom_out", "pan_left", "pan_right", "orbit", "static"]).optional(),
  seed: z.number().int().optional(),
});

export const flowNodeConfigSchema = z.record(z.string(), z.any());

export const flowNodeInputSchema = z.object({
  id: z.string().optional(),
  nodeType: flowNodeTypeSchema,
  toolSlug: z.string().nullable().optional(),
  title: z.string().min(1).max(100),
  positionX: z.number(),
  positionY: z.number(),
  config: flowNodeConfigSchema.default({}),
});

export const flowConnectionInputSchema = z.object({
  id: z.string().optional(),
  sourceNodeId: z.string(),
  sourceHandle: z.string(),
  targetNodeId: z.string(),
  targetHandle: z.string(),
});

export const createFlowSchema = z.object({
  name: z.string().min(1, "O nome do flow é obrigatório.").max(100),
  description: z.string().max(500).optional(),
  viewport: flowViewportSchema.optional(),
  nodes: z.array(flowNodeInputSchema).default([]),
  connections: z.array(flowConnectionInputSchema).default([]),
});

export const updateFlowSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  status: flowStatusSchema.optional(),
  viewport: flowViewportSchema.optional().nullable(),
  nodes: z.array(flowNodeInputSchema).optional(),
  connections: z.array(flowConnectionInputSchema).optional(),
});

export const executeFlowSchema = z.object({
  idempotencyKey: z.string().uuid("A chave de idempotência deve ser um UUID válido.").optional(),
  nodeIds: z.array(z.string()).optional(),
});

export type CreateFlowInput = z.infer<typeof createFlowSchema>;
export type UpdateFlowInput = z.infer<typeof updateFlowSchema>;
export type ExecuteFlowInput = z.infer<typeof executeFlowSchema>;
export type FlowNodeInput = z.infer<typeof flowNodeInputSchema>;
export type FlowConnectionInput = z.infer<typeof flowConnectionInputSchema>;
