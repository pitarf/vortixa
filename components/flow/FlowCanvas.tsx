"use client";

import React, { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowStore } from "@/stores/flow-store";
import { PromptNode } from "./nodes/PromptNode";
import { ImageNode } from "./nodes/ImageNode";
import { VideoNode } from "./nodes/VideoNode";
import { LipSyncNode } from "./nodes/LipSyncNode";
import { UpscaleNode } from "./nodes/UpscaleNode";
import { CustomEdge } from "./edges/CustomEdge";
import { FlowToolbar } from "./toolbar/FlowToolbar";
import { NodePicker } from "./toolbar/NodePicker";
import { NodeInspector } from "./inspector/NodeInspector";
import { AIFlowBuilderModal } from "./ai-builder/AIFlowBuilderModal";
import { MediaLightbox } from "./preview/MediaLightbox";
import { RunFlowModal } from "./toolbar/RunFlowModal";

import type { NodeTypes, EdgeTypes } from "@xyflow/react";

const nodeTypes: NodeTypes = {
  prompt: PromptNode as any,
  image: ImageNode as any,
  video: VideoNode as any,
  lipsync: LipSyncNode as any,
  upscale: UpscaleNode as any,
  custom: PromptNode as any,
  export: UpscaleNode as any,
  motion: VideoNode as any,
  audio: PromptNode as any,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge as any,
};

function FlowCanvasInner() {
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setViewport,
    setNodePickerOpen,
  } = useFlowStore();

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.25, duration: 400 });
  }, [reactFlowInstance]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setNodePickerOpen(true, position);
    },
    [reactFlowInstance, setNodePickerOpen]
  );

  const onMoveEnd = useCallback(
    (_: any, viewport: { x: number; y: number; zoom: number }) => {
      setViewport(viewport);
    },
    [setViewport]
  );

  return (
    <div ref={reactFlowWrapper} className="relative w-full h-full bg-[#070709] select-none overflow-hidden">
      {/* Toolbar Principal Superior */}
      <FlowToolbar onFitView={handleFitView} />

      {/* Canvas Infinito React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onContextMenu={onContextMenu}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2}
        deleteKeyCode={["Backspace", "Delete"]}
        multiSelectionKeyCode={["Meta", "Control"]}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
      >
        {/* Background Dot Matrix Dark Obsidian */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#1E202E"
          className="opacity-70"
        />

        {/* Controles de Zoom Flutuantes */}
        <Controls
          showInteractive={false}
          className="!bg-slate-950/80 !backdrop-blur-xl !border !border-slate-800/80 !rounded-2xl !p-1 !shadow-2xl [&>button]:!bg-slate-900/60 [&>button]:!border-slate-800 [&>button]:!text-slate-300 hover:[&>button]:!bg-slate-800"
          style={{ bottom: 20, left: 20 }}
        />

        {/* MiniMap Premium Dark */}
        <MiniMap
          nodeColor={(n) => {
            switch (n.type) {
              case "prompt":
                return "#8B5CF6";
              case "image":
                return "#06B6D4";
              case "video":
                return "#10B981";
              case "lipsync":
                return "#EC4899";
              case "upscale":
                return "#F59E0B";
              default:
                return "#334155";
            }
          }}
          maskColor="rgba(7, 7, 9, 0.85)"
          className="!bg-slate-950/90 !backdrop-blur-xl !border !border-slate-800/80 !rounded-2xl !overflow-hidden !shadow-2xl hidden md:block"
          style={{ bottom: 20, right: 20, width: 180, height: 110 }}
        />
      </ReactFlow>

      {/* Inspetor Lateral de Nós */}
      <NodeInspector />

      {/* Modais e Palettes */}
      <NodePicker />
      <AIFlowBuilderModal />
      <RunFlowModal />
      <MediaLightbox />
    </div>
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
