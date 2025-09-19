"use client";
import type { AnalysisInputPayload } from "@/components/analysis/analysis";
import { AnalysisReport } from "@/components/analysis/analysis-report";
import { AnalyzeButton } from "@/components/analysis/analyze-button";
import EmptyCard from "@/components/empty-card";
import { Card, CardContent } from "@/components/ui/card";
import { useConsumptionAnalysis } from "@/hooks/use-consumption-analysis";

export default function Dashboard(props: AnalysisInputPayload) {
  const { analysis, loading, error, lastRunAt, analyze } =
    useConsumptionAnalysis(props);

  return (
    <main className="w-full">
      <div className="flex items-center justify-between">
        <AnalyzeButton onClick={analyze} loading={loading} />
        {lastRunAt && (
          <span className="text-muted-foreground ml-2 text-xs">
            Última análise: {lastRunAt.toLocaleString()}
          </span>
        )}
      </div>

      <section className="space-y-2">
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="text-destructive p-4 text-sm">
              {error}
            </CardContent>
          </Card>
        )}

        {!loading && !analysis && !error && (
          <Card>
            <EmptyCard />
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-4 text-sm">
              Carregando análise…
            </CardContent>
          </Card>
        )}

        {analysis && <AnalysisReport analysis={analysis} month={props.month} />}
      </section>

      <footer className="h-8" />
    </main>
  );
}
