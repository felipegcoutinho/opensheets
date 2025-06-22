"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiLoader2Line, RiMagicLine } from "@remixicon/react";
import { useState, useTransition } from "react";
import { generateInsights } from "@/actions/insights";

interface Analysis {
  comportamentos_observados: string[];
  gatilhos_de_consumo: string[];
  recomendações_práticas: string[];
  melhorias_sugeridas: string[];
}

function Home({ month }: { month: string }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    startTransition(async () => {
      setAnalysis(null);

      try {
        const formData = new FormData();
        formData.append("month", month);
        const result = await generateInsights(null, formData);
        setAnalysis(result);
      } catch (error) {
        console.error("Erro ao buscar análise:", error);
      }
    });
  };

  return (
    <>
      <Button
        onClick={handleAnalyze}
        disabled={isPending}
        className="from-primary dark:to-chart-1 to-contrast-foreground my-2 w-72 bg-gradient-to-tr transition-all hover:scale-110"
      >
        <div className="flex items-center justify-center gap-2">
          {isPending ? (
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
                <h3 className="mb-4 text-2xl font-bold">
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
                <h3 className="mb-4 text-2xl font-bold">
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
                <h3 className="mb-4 text-2xl font-bold">
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
                <h3 className="mb-4 text-2xl font-bold">
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
