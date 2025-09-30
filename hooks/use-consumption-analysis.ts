"use client";

import type { Analysis, AnalysisInputPayload } from "@/components/analysis/analysis";
import { runConsumptionAnalysis } from "@/actions/analysis/run_analysis";
import { useCallback, useEffect, useRef, useState } from "react";

type AnalysisCache = Map<
  string,
  { fingerprint: string; analysis: Analysis; generatedAt: Date }
>;

export function useConsumptionAnalysis(payload: AnalysisInputPayload) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);

  const cacheRef = useRef<AnalysisCache>(new Map());
  const fingerprintRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    setError(null);
    setAnalysis(null);
    setLastRunAt(null);
    // mantém fingerprint para reaproveitar cache ao alternar meses
  }, [payload.month]);

  const analyze = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    const currentFingerprint = fingerprintRef.current.get(payload.month);

    if (currentFingerprint) {
      const cached = cacheRef.current.get(currentFingerprint);
      if (cached) {
        setAnalysis(cached.analysis);
        setLastRunAt(cached.generatedAt);
      }
    }

    try {
      const result = await runConsumptionAnalysis({
        month: payload.month,
        fingerprint: currentFingerprint,
      });

      if (result.status === "error") {
        setAnalysis(null);
        setError(result.message);
        return;
      }

      if (result.status === "unchanged") {
        if (currentFingerprint) {
          const cached = cacheRef.current.get(currentFingerprint);
          if (cached) {
            setAnalysis(cached.analysis);
            setLastRunAt(cached.generatedAt);
          }
        }
        return;
      }

      cacheRef.current.set(result.fingerprint, {
        fingerprint: result.fingerprint,
        analysis: result.analysis,
        generatedAt: new Date(),
      });
      fingerprintRef.current.set(payload.month, result.fingerprint);
      setAnalysis(result.analysis);
      setLastRunAt(new Date());
    } catch (err) {
      console.error("Erro ao gerar análise:", err);
      setAnalysis(null);
      setError(
        "Não foi possível gerar a análise agora. Tente novamente em alguns segundos.",
      );
    } finally {
      setLoading(false);
    }
  }, [loading, payload.month]);

  return { analysis, loading, error, lastRunAt, analyze } as const;
}
