"use client";
import type {
  Analysis,
  AnalysisInputPayload,
} from "@/components/analysis/analysis";
import { hashPayload } from "@/lib/hash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function coerceAnalysis(json: unknown): Analysis {
  const safe = (arr: unknown): string[] =>
    Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  const obj = (typeof json === "string" ? JSON.parse(json) : json) as Record<
    string,
    unknown
  >;
  return {
    comportamentos_observados: safe(obj?.comportamentos_observados),
    gatilhos_de_consumo: safe(obj?.gatilhos_de_consumo),
    recomendações_práticas: safe(obj?.recomendações_práticas),
    melhorias_sugeridas: safe(obj?.melhorias_sugeridas),
  };
}

export function useConsumptionAnalysis(payload: AnalysisInputPayload) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);

  const cacheRef = useRef<Map<string, Analysis>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  const cacheKey = useMemo(
    () => `${payload.month}:${hashPayload(payload)}`,
    [payload],
  );

  useEffect(() => {
    setAnalysis(null);
    setError(null);
    abortRef.current?.abort();
    abortRef.current = null;
  }, [cacheKey]);

  const analyze = useCallback(async () => {
    if (loading) return;

    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setAnalysis(cached);
      setError(null);
      setLastRunAt(new Date());
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: JSON.stringify(payload.lancamentos) },
            { role: "user", content: JSON.stringify(payload.cartoes) },
            { role: "user", content: JSON.stringify(payload.categorias ?? []) },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`API respondeu ${response.status}`);

      const data = await response.json();
      const parsed = coerceAnalysis(data?.analysis);

      cacheRef.current.set(cacheKey, parsed);
      setAnalysis(parsed);
      setLastRunAt(new Date());
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return;
      console.error("Erro ao buscar análise:", err);
      setError(
        "Não foi possível gerar a análise agora. Tente novamente em alguns segundos.",
      );
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, loading, payload]);

  return { analysis, loading, error, lastRunAt, analyze } as const;
}
