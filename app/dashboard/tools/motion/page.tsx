"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";
import { FileUploader } from "@/components/ai/file-uploader";

export default function MotionToolPage() {
  return (
    <GenerationLayout
      toolSlug="motion-control"
      title="Motion Control"
      description="Transfira poses e movimentos corporais de um vídeo de referência para uma imagem estática de personagem."
      initialInputs={{
        prompt: "",
        character_image_url: "",
        reference_video_url: "",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileUploader
              accept="image/*"
              label="1. Personagem (Imagem)"
              onUploadSuccess={(url) => setInputVal("character_image_url", url)}
              onClear={() => setInputVal("character_image_url", "")}
            />

            <FileUploader
              accept="video/*"
              label="2. Movimento (Vídeo de Referência)"
              onUploadSuccess={(url) => setInputVal("reference_video_url", url)}
              onClear={() => setInputVal("reference_video_url", "")}
            />
          </div>

          <PromptInput
            value={inputs.prompt || ""}
            onChange={(val) => setInputVal("prompt", val)}
            placeholder="Opcional: Detalhes adicionais sobre a cena final..."
            label="Prompt de Apoio (Opcional)"
          />
        </div>
      )}
    </GenerationLayout>
  );
}
