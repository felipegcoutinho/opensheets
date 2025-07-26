"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiLoader2Line, RiMagicLine } from "@remixicon/react";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

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
        className="bg-primary my-2 w-72 text-white transition hover:opacity-90"
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

      {analysis && (
        <Card className="my-2 w-full">
          <CardHeader>
            <CardTitle>💼 Análise Comportamental de Consumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Comportamentos Observados */}
              <Card className="p-4">
                <h3 className="mb-4 text-xl font-semibold">
                  🔍 Comportamentos Observados
                </h3>
                <ul className="space-y-2">
                  {analysis.comportamentos_observados.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Card>

              {/* Gatilhos de Consumo */}
              <Card className="p-4">
                <h3 className="mb-4 text-xl font-semibold">
                  ⚠️ Gatilhos de Consumo
                </h3>
                <ul className="space-y-2">
                  {analysis.gatilhos_de_consumo.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Card>

              {/* Recomendações Práticas */}
              <Card className="col-span-1 p-4 md:col-span-2">
                <h3 className="mb-4 text-xl font-semibold">
                  ✅ Recomendações Práticas
                </h3>
                <ul className="space-y-2">
                  {analysis.recomendações_práticas.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Card>

              {/* Melhorias Sugeridas */}
              <Card className="col-span-1 p-4 md:col-span-2">
                <h3 className="mb-4 text-xl font-semibold">
                  🚀 Melhorias Sugeridas
                </h3>
                <ul className="space-y-2">
                  {analysis.melhorias_sugeridas.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default Home;
