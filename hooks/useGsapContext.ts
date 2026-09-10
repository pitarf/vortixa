"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Hook customizado para encapsular animacoes GSAP no React 19 / Next.js.
 * Utiliza gsap.context() para gerenciar escopo atomico de seletores e cleanup automatico ao desmontar.
 */
export function useGsapContext(
  animationCallback: (context: gsap.Context) => void,
  dependencies: any[] = []
) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Respeita preferencias de acessibilidade de movimento reduzido
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      animationCallback(ctx);
    }, scopeRef);

    return () => {
      ctx.revert(); // Reverte todas as propriedades CSS e remove ScrollTriggers criados
    };
  }, dependencies);

  return scopeRef;
}

export { gsap, ScrollTrigger };
