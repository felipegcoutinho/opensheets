"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { LucideStars } from "lucide-react";

type Analysis = {
  resumo: {
    total_receitas: string;
    total_despesas: string;
    saldo: string;
  };
  insights_gerais: string[];
  categorias_relevantes: {
    categoria: string;
    valor_total: string;
    percentual_sobre_total: string;
  }[];
  padrões_de_gastos: string[];
  alertas: string[];
  recomendações: string[];
};

function Home({
  lancamentos,
  boletos,
  cartoes,
  month,
}: {
  lancamentos: any[];
  boletos: any[];
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
              { role: "user", content: JSON.stringify(boletos) },
              { role: "user", content: JSON.stringify(cartoes) },
            ],
          }),
        },
      );

      const { analysis } = await response.json();
      setAnalysis(JSON.parse(analysis)); // <- transforma texto JSON em objeto
    } catch (error) {
      console.error("Erro ao buscar análise:", error);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 w-full">
      <div>
        <h1 className="text-2xl font-bold">Análise Financeira de {month}</h1>
        <p className="text-muted-foreground text-sm">
          Clique no botão abaixo para analisar suas finanças.
        </p>
      </div>

      <Button onClick={handleAnalyze} disabled={loading} className="my-4 w-52">
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Spinner className="h-4 w-4" /> Analisando...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <LucideStars className="h-4 w-4" /> Analisar minhas finanças
          </div>
        )}
      </Button>

      {analysis && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Resumo */}
          <Card className="p-4">
            <h3 className="mb-2 text-lg font-bold">🎯 Resumo</h3>
            <p>
              <strong>Receitas:</strong> {analysis.resumo.total_receitas}
            </p>
            <p>
              <strong>Despesas:</strong> {analysis.resumo.total_despesas}
            </p>
            <p>
              <strong>Balanço:</strong> {analysis.resumo.saldo}
            </p>
          </Card>

          {/* Insights Gerais */}
          <Card className="p-4">
            <h3 className="mb-2 text-lg font-bold">💡 Insights Gerais</h3>
            <ul className="list-inside list-disc space-y-1">
              {analysis.insights_gerais.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </Card>

          {/* Categorias Relevantes */}
          <Card className="col-span-1 p-4 md:col-span-2">
            <h3 className="mb-2 text-lg font-bold">📊 Categorias Relevantes</h3>
            <ul className="list-inside list-disc space-y-1">
              {analysis.categorias_relevantes.map((cat, idx) => (
                <li key={idx}>
                  {cat.categoria}: {cat.valor_total} (
                  {cat.percentual_sobre_total})
                </li>
              ))}
            </ul>
          </Card>

          {/* Padrões de Gastos */}
          <Card className="p-4">
            <h3 className="mb-2 text-lg font-bold">📈 Padrões de Gastos</h3>
            <ul className="list-inside list-disc space-y-1">
              {analysis.padrões_de_gastos.map((padrao, idx) => (
                <li key={idx}>{padrao}</li>
              ))}
            </ul>
          </Card>

          {/* Alertas */}
          <Card className="p-4">
            <h3 className="mb-2 text-lg font-bold">🚨 Alertas</h3>
            <ul className="list-inside list-disc space-y-1">
              {analysis.alertas.map((alerta, idx) => (
                <li key={idx}>{alerta}</li>
              ))}
            </ul>
          </Card>

          {/* Recomendações */}
          <Card className="col-span-1 p-4 md:col-span-2">
            <h3 className="mb-2 text-lg font-bold">🛡️ Recomendações</h3>
            <ul className="list-inside list-disc space-y-1">
              {analysis.recomendações.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Home;
