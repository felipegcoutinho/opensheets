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
    <Card className="w-full border-none bg-transparent">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl">
          Relatório de Comportamento de Consumo
        </CardTitle>
        <div className="text-muted-foreground mt-2">
          <p>
            No período selecionado (<span className="font-medium">{month}</span>
            ), identificamos os principais comportamentos e gatilhos que
            impactaram seu padrão de consumo.
          </p>
          <p>Segue um panorama prático com recomendações acionáveis.</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 sm:gap-2">
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Comportamentos Observados"
              analysis={analysis.comportamentos_observados}
              color="bg-amber-200"
            />
          </section>
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Gatilhos de Consumo"
              analysis={analysis.gatilhos_de_consumo}
              color="bg-red-200"
            />
          </section>
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Recomendações Práticas"
              analysis={analysis.recomendações_práticas}
              color="bg-emerald-200"
            />
          </section>
          <section className="py-1 sm:py-2">
            <InsightCard
              title="Melhorias Sugeridas"
              analysis={analysis.melhorias_sugeridas}
              color="bg-purple-200"
            />
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
