"use client";
import EmptyCard from "@/components/empty-card";
import InsightCard from "@/components/insight-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiLoader2Line, RiMagicLine } from "@remixicon/react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface Analysis {
  comportamentos_observados: string[];
  gatilhos_de_consumo: string[];
  recomendações_práticas: string[];
  melhorias_sugeridas: string[];
}

function Home({
  lancamentos,
  cartoes,
  categorias,
  month,
}: {
  lancamentos: any[];
  cartoes: any[];
  month: string;
}) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Analysis | null>(null);

  const messages = useMemo(
    () => [
      { role: "user", content: JSON.stringify(lancamentos) },
      { role: "user", content: JSON.stringify(cartoes) },
      { role: "user", content: JSON.stringify(categorias) },
    ],
    [lancamentos, cartoes, categorias],
  );

  useEffect(() => {
    cacheRef.current = null;
  }, [messages]);

  const handleAnalyze = useCallback(async () => {
    if (cacheRef.current) {
      setAnalysis(cacheRef.current);
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const { analysis } = await response.json();
      const parsed = JSON.parse(analysis);
      cacheRef.current = parsed;
      setAnalysis(parsed);
    } catch (error) {
      console.error("Erro ao buscar análise:", error);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return (
    <>
      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-primary w-72 text-white transition hover:opacity-90"
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <RiLoader2Line className="h-4 w-4 animate-spin" />
              <span>Aguarde, analisando...</span>
            </>
          ) : (
            <>
              <RiMagicLine className="h-4 w-4" />
              <span>Analisar minhas finanças com IA</span>
            </>
          )}
        </div>
      </Button>

      {!analysis && (
        <Card className="mt-4 w-full">
          <EmptyCard />
        </Card>
      )}

      {analysis && (
        <Card className="my-2 w-full border-none dark:bg-transparent">
          <CardHeader className="p-0">
            <CardTitle className="text-xl">
              Relatório de Comportamento de Consumo
            </CardTitle>

            <div className="text-muted-foreground mt-2">
              <p>
                No período selecionado ({month}), identificamos os principais
                comportamentos e gatilhos que impactaram seu padrão de consumo.
              </p>
              <p>
                A seguir, apresentamos um overview das descobertas e
                recomendações estratégicas.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="space-y-2">
              {/* Comportamentos Observados */}
              <InsightCard
                title="Comportamentos Observados"
                analysis={analysis.comportamentos_observados}
                color="bg-amber-200"
              />

              {/* Gatilhos de Consumo */}
              <InsightCard
                title="Gatilhos de Consumo"
                analysis={analysis.gatilhos_de_consumo}
                color="bg-red-200"
              />

              {/* Recomendações Práticas */}
              <InsightCard
                title="Recomendações Práticas"
                analysis={analysis.recomendações_práticas}
                color="bg-emerald-200"
              />

              {/* Melhorias Sugeridas */}
              <InsightCard
                title="Melhorias Sugeridas"
                analysis={analysis.melhorias_sugeridas}
                color="bg-purple-200"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default Home;
