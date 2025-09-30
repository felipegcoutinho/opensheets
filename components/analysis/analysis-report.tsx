"use client";
import type { Analysis } from "@/components/analysis/analysis";
import InsightCard from "@/components/insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalysisReport({
  analysis,
  month,
}: {
  analysis: Analysis;
  month: string;
}) {
  return (
    <Card className="w-full px-2 sm:px-4">
      <CardHeader className="px-2">
        <CardTitle className="text-xl">
          Relatório de Comportamento de Consumo
        </CardTitle>
        <div className="text-muted-foreground mt-2">
          <p>
            No período selecionado (<span className="font-bold">{month}</span>
            ), identificamos os principais comportamentos e gatilhos que
            impactaram seu padrão de consumo.
          </p>
          <p>Segue um panorama prático com recomendações acionáveis.</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-4">
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Comportamentos Observados"
              analysis={analysis.comportamentos_observados}
              tone="amber"
            />
          </section>
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Gatilhos de Consumo"
              analysis={analysis.gatilhos_de_consumo}
              tone="lavender"
            />
          </section>
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Recomendações Práticas"
              analysis={analysis.recomendações_práticas}
              tone="mint"
            />
          </section>
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Melhorias Sugeridas"
              analysis={analysis.melhorias_sugeridas}
              tone="violet"
            />
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
