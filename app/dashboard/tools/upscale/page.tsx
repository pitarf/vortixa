"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";

export default function UpscaleToolPage() {
  return (
    <GenerationLayout
      toolSlug="upscale"
      title="Video Upscale"
      description="Aumente a definição e melhore a qualidade de seus vídeos gerados com inteligência artificial."
      initialInputs={{
        video_url: "",
        scale_factor: "2",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          <FileUploader
            accept="video/*"
            label="Vídeo de Origem"
            onUploadSuccess={(url) => setInputVal("video_url", url)}
            onClear={() => setInputVal("video_url", "")}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Escala de Upscale</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "2x Resolução", value: "2" },
                { name: "4x Resolução", value: "4" },
              ].map((scale) => (
                <button
                  key={scale.value}
                  type="button"
                  onClick={() => setInputVal("scale_factor", scale.value)}
                  className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                    inputs.scale_factor === scale.value
                      ? "bg-violet-600/10 border-violet-500 text-violet-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  {scale.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
