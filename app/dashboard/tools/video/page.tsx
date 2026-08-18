"use client";

import React, { useState } from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";
import { FileUploader } from "@/components/ai/file-uploader";

export default function VideoToolPage() {
  const [mode, setMode] = useState<"text" | "image">("text");

  return (
    <GenerationLayout
      toolSlug="imagem-video"
      title="Imagem/Texto para Vídeo"
      description="Crie vídeos realistas a partir de descrições textuais ou dando movimento a uma imagem."
      initialInputs={{
        prompt: "",
        image_url: "",
        duration: "5",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          {/* Seletor de Modo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Modo de Geração</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("text");
                  setInputVal("image_url", "");
                }}
                className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                  mode === "text"
                    ? "bg-violet-600/10 border-violet-500 text-violet-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
                style={{ minHeight: "44px" }}
              >
                Texto para Vídeo
              </button>
              <button
                type="button"
                onClick={() => setMode("image")}
                className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                  mode === "image"
                    ? "bg-violet-600/10 border-violet-500 text-violet-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
                style={{ minHeight: "44px" }}
              >
                Imagem para Vídeo
              </button>
            </div>
          </div>

          {mode === "image" && (
            <FileUploader
              accept="image/*"
              label="Imagem Estática de Origem"
              onUploadSuccess={(url) => setInputVal("image_url", url)}
              onClear={() => setInputVal("image_url", "")}
            />
          )}

          <PromptInput
            value={inputs.prompt || ""}
            onChange={(val) => setInputVal("prompt", val)}
            placeholder={
              mode === "image"
                ? "Descreva a movimentação ou a ação desejada no vídeo... Ex: A câmera faz zoom lento enquanto o cabelo da moça voa ao vento"
                : "Descreva a cena cinematográfica que deseja gerar... Ex: Um astronauta caminhando na areia vermelha de Marte, iluminação dramática"
            }
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Duração</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "5 Segundos", value: "5" },
                { name: "10 Segundos", value: "10" },
              ].map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setInputVal("duration", dur.value)}
                  className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                    inputs.duration === dur.value
                      ? "bg-violet-600/10 border-violet-500 text-violet-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  {dur.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
