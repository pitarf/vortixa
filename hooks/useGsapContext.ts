"use client";

import { useEffect, useRef } from "react";

/**
 * Hook seguro para GSAP em Next.js / Turbopack (Client-Side Dynamic Import).
 * Carrega o GSAP e o ScrollTrigger assincronamente apenas no navegador,
 * evitando quebra de execucao no bundle SSR do Next.js.
 */
export function useGsapContext(
  animationCallback: (gsapInstance: any, scrollTriggerInstance: any, context: any) => void,
  dependencies: any[] = []
) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any = null;

    const initGsap = async () => {
      try {
        if (typeof window === "undefined") return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        gsap.registerPlugin(ScrollTrigger);

        if (scopeRef.current) {
          ctx = gsap.context(() => {
            animationCallback(gsap, ScrollTrigger, ctx);
          }, scopeRef);
        }
      } catch (err) {
        console.warn("GSAP animation skipped:", err);
      }
    };

    initGsap();

    return () => {
      if (ctx && typeof ctx.revert === "function") {
        ctx.revert();
      }
    };
  }, dependencies);

  return scopeRef;
}
