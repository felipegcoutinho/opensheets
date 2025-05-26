"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";

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

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              { role: "user", content: JSON.stringify(lancamentos) },
              { role: "user", content: JSON.stringify(cartoes) },
              { role: "user", content: JSON.stringify(categorias) },
              // {
              //   role: "user",
              //   content: `Me dê uma análise em inglês`,
              // },
            ],
          }),
        },
      );

      const { analysis } = await response.json();
      setAnalysis(JSON.parse(analysis));
    } catch (error) {
      console.error("Erro ao buscar análise:", error);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleAnalyze}
        disabled={loading}
        className="to-primary dark:to-chart-1 my-2 w-72 bg-gradient-to-l from-violet-600 transition-all hover:scale-110"
      >
        <div className="flex items-center justify-center gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Aguarde, analisando...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
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
