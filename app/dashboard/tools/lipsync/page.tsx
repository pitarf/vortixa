"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";

export default function LipSyncToolPage() {
  return (
    <GenerationLayout
      toolSlug="lip-sync"
      title="Lip Sync"
      description="Sincronize com perfeição a fala e os movimentos labiais de um personagem de vídeo com qualquer áudio."
      initialInputs={{
        video_url: "",
        audio_url: "",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileUploader
              accept="video/*"
              label="1. Vídeo Original"
              onUploadSuccess={(url) => setInputVal("video_url", url)}
              onClear={() => setInputVal("video_url", "")}
            />

            <FileUploader
              accept="audio/*"
              label="2. Áudio de Fala"
              onUploadSuccess={(url) => setInputVal("audio_url", url)}
              onClear={() => setInputVal("audio_url", "")}
            />
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
