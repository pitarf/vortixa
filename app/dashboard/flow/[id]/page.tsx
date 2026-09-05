"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { FlowCanvas } from "@/components/flow/FlowCanvas";
import { useFlowStore } from "@/stores/flow-store";
import { Loader2 } from "lucide-react";

export default function FlowEditorPage() {
  const params = useParams();
  const flowId = params.id as string;
  const { loadFlow, flowId: currentFlowId } = useFlowStore();

  useEffect(() => {
    if (flowId) {
      loadFlow(flowId).catch((err) => {
        console.error("Erro ao carregar o fluxo:", err);
      });
    }
  }, [flowId, loadFlow]);

  return (
    <div className="fixed inset-0 top-16 md:left-64 z-20 overflow-hidden bg-black">
      <FlowCanvas />
    </div>
  );
}
