"use client";

import React, { useState, useEffect } from "react";
import { Bot, Zap } from "lucide-react";
import { toast } from "sonner";

export function ProviderModeSwitch() {
  const [mode, setMode] = useState<"live" | "mock">("live");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    fetch("/api/tools/mode")
      .then((res) => {
        if (!res.ok) {
          setAuthorized(false);
          throw new Error("Não autorizado");
        }
        return res.json();
      })
      .then((data) => {
        if (data.mode) setMode(data.mode);
      })
      .catch(() => {
        setAuthorized(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!authorized) return null;

  const toggleMode = async () => {
    const nextMode = mode === "live" ? "mock" : "live";
    setLoading(true);

    try {
      const res = await fetch("/api/tools/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });

      if (res.ok) {
        setMode(nextMode);
        if (nextMode === "live") {
          toast.success("🚀 Motor VORTIXIA Turbo Ativado (Alta Definição)");
        } else {
          toast.info("🛡️ Modo Simulação Ativado");
        }
      } else {
        toast.error("Erro ao alternar o modo de IA.");
      }
    } catch {
      toast.error("Erro de conexão ao alterar modo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-[#0D0E12] border border-[#1E202E]">
      <button
        onClick={toggleMode}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
          mode === "live"
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500/40"
            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
        }`}
        title={mode === "live" ? "Modo VORTIXIA Cloud Turbo Ativo" : "Modo Simulação Local Ativo"}
      >
        {mode === "live" ? (
          <>
            <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>VORTIXIA Turbo</span>
          </>
        ) : (
          <>
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulação</span>
          </>
        )}
      </button>
    </div>
  );
}
