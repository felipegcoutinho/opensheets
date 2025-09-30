"use client";
import type { AnalysisInputPayload } from "@/components/analysis/analysis";
import { AnalysisReport } from "@/components/analysis/analysis-report";
import { AnalyzeButton } from "@/components/analysis/analyze-button";
import EmptyCard from "@/components/empty-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
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
            <CardContent className="space-y-4 p-4">
              <div className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                <Terminal>
                  <TypingAnimation>
                    Iniciando a análise do seu perfil financeiro 🚀
                  </TypingAnimation>
                  <TypingAnimation>
                    Carregando seus dados com todo cuidado 🔒
                  </TypingAnimation>
                  <AnimatedSpan className="text-green-600">
                    ✅ Feito
                  </AnimatedSpan>
                  <TypingAnimation>
                    Observando como você ganha e gasta 💸
                  </TypingAnimation>
                  <AnimatedSpan className="text-green-600">
                    ✅ Feito
                  </AnimatedSpan>
                  <TypingAnimation>
                    Procurando formas de economizar sem perder qualidade de vida
                    🌱
                  </TypingAnimation>
                  <AnimatedSpan className="text-green-600">
                    ✅ Feito
                  </AnimatedSpan>
                  <TypingAnimation>
                    Caçando boas oportunidades para investir no futuro 📈
                  </TypingAnimation>
                  <AnimatedSpan className="text-green-600">
                    ✅ Feito
                  </AnimatedSpan>
                  <TypingAnimation>
                    Preparando recomendações que combinam com o seu jeito ✨
                  </TypingAnimation>
                  <AnimatedSpan className="text-green-600">
                    ✅ Feito
                  </AnimatedSpan>
                  <TypingAnimation>
                    Estamos quase lá… montando seu relatório especial 📊
                  </TypingAnimation>
                  <TypingAnimation>
                    Finalizando a análise, só mais um instante ⏳
                  </TypingAnimation>
                </Terminal>
              </div>
            </CardContent>
          </Card>
        )}

        {analysis && <AnalysisReport analysis={analysis} month={props.month} />}
      </section>

      <footer className="h-8" />
    </main>
  );
}
