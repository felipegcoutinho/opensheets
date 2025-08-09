"use client";
import { AnalyzeButton } from "@/components/analysis/analyze-button";
import { AnalysisReport } from "@/components/analysis/analysis-report";
import { AnalysisSkeleton } from "@/components/analysis/analysis-skeleton";
import EmptyCard from "@/components/empty-card";
import { Card, CardContent } from "@/components/ui/card";
import { useConsumptionAnalysis } from "@/hooks/use-consumption-analysis";
import type { AnalysisInputPayload } from "@/types/analysis";

export default function Dashboard(props: AnalysisInputPayload) {
  const { analysis, loading, error, lastRunAt, analyze } = useConsumptionAnalysis(props);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-10 -mx-4 mb-2 bg-background/60 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/40 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Análise de Consumo</h1>
          <div className="flex items-center gap-3">
            <AnalyzeButton onClick={analyze} loading={loading} />
            {lastRunAt && (
              <span className="text-sm text-muted-foreground">Última análise: {lastRunAt.toLocaleString()}</span>
            )}
          </div>
        </div>
      </header>

      <section className="space-y-4">
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {!loading && !analysis && !error && (
          <Card>
            <EmptyCard />
          </Card>
        )}

        {loading && <AnalysisSkeleton month={props.month} />}

        {analysis && <AnalysisReport analysis={analysis} month={props.month} />}
      </section>

      <footer className="h-8" />
    </main>
  );
}
