"use client";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import EmptyCard from "@/components/empty-card";
import InsightCard from "@/components/insight-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiLoader2Line, RiMagicLine } from "@remixicon/react";

/**
 * Tipagem de domínio: mantenha o componente previsível e seguro.
 */
interface Analysis {
  comportamentos_observados: string[];
  gatilhos_de_consumo: string[];
  recomendações_práticas: string[];
  melhorias_sugeridas: string[];
}

interface HomeProps {
  lancamentos: unknown[];
  cartoes: unknown[];
  categorias?: unknown[];
  month: string; // Ex.: "2025-08"
}

/**
 * Utilitário de hash simples para invalidar cache quando os dados mudarem.
 * Não-criptográfico, apenas para chavear memória local.
 */
function hashPayload(input: unknown): string {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/**
 * Skeleton leve sem dependências externas.
 */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-md ${className}`} />;
}

/**
 * Validação defensiva do retorno da API.
 */
function coerceAnalysis(json: unknown): Analysis {
  const safe = (arr: unknown): string[] =>
    Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];

  const obj = (typeof json === "string" ? JSON.parse(json) : json) as Record<
    string,
    unknown
  >;
  return {
    comportamentos_observados: safe(obj?.comportamentos_observados),
    gatilhos_de_consumo: safe(obj?.gatilhos_de_consumo),
    recomendações_práticas: safe(obj?.recomendações_práticas),
    melhorias_sugeridas: safe(obj?.melhorias_sugeridas),
  };
}

export default function Home({
  lancamentos,
  cartoes,
  categorias,
  month,
}: HomeProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunAt, setLastRunAt] = useState<Date | null>(null);

  // Cache em memória por chave derivada do conteúdo + mês.
  const cacheRef = useRef<Map<string, Analysis>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  // Pacote de dados enviado ao endpoint — estável e serializável.
  const payload = useMemo(
    () => ({ lancamentos, cartoes, categorias: categorias ?? [], month }),
    [lancamentos, cartoes, categorias, month],
  );

  const cacheKey = useMemo(
    () => `${month}:${hashPayload(payload)}`,
    [month, payload],
  );

  // Invalida somente quando o hash mudar (dados diferentes de fato).
  useEffect(() => {
    setAnalysis(null);
    setError(null);
    abortRef.current?.abort();
    abortRef.current = null;
  }, [cacheKey]);

  const handleAnalyze = useCallback(async () => {
    if (loading) return; // Evita cliques repetidos.

    // Cache hit: resposta instantânea.
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setAnalysis(cached);
      setError(null);
      setLastRunAt(new Date());
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    // Cancela requisição anterior, se existir.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: JSON.stringify(lancamentos) },
            { role: "user", content: JSON.stringify(cartoes) },
            { role: "user", content: JSON.stringify(categorias ?? []) },
          ],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API respondeu ${response.status}`);
      }

      const data = await response.json();
      const parsed = coerceAnalysis(data?.analysis);

      cacheRef.current.set(cacheKey, parsed);
      setAnalysis(parsed);
      setLastRunAt(new Date());
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") return; // Usuário trocou o período/dados.
      console.error("Erro ao buscar análise:", err);
      setError(
        "Não foi possível gerar a análise agora. Tente novamente em alguns segundos.",
      );
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [cacheKey, categorias, cartoes, lancamentos, loading]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* CTA */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-primary w-72 text-white transition hover:opacity-90"
          aria-busy={loading}
          aria-live="polite"
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
        {lastRunAt && (
          <span className="text-muted-foreground text-sm">
            Última análise: {lastRunAt.toLocaleString()}
          </span>
        )}
      </div>

      {/* Estados: erro / vazio / carregando / sucesso */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="text-destructive p-4 text-sm">
            {error}
          </CardContent>
        </Card>
      )}

      {!loading && !analysis && !error && (
        <Card className="w-full">
          <EmptyCard />
        </Card>
      )}

      {loading && (
        <Card className="w-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">
              Montando seu relatório inteligente…
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Estamos sintetizando padrões, gatilhos e recomendações para o
              período {month}.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card className="from-background to-muted/30 dark:to-muted/10 my-2 w-full border-none bg-gradient-to-b dark:bg-gradient-to-b dark:from-transparent">
          <CardHeader className="p-0">
            <CardTitle className="text-xl">
              Relatório de Comportamento de Consumo
            </CardTitle>
            <div className="text-muted-foreground mt-2">
              <p>
                No período selecionado (
                <span className="font-medium">{month}</span>), identificamos os
                principais comportamentos e gatilhos que impactaram seu padrão
                de consumo.
              </p>
              <p>
                A seguir, apresentamos um panorama prático com recomendações
                acionáveis.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-border/50 divide-y">
              <section className="py-3">
                <InsightCard
                  title="Comportamentos Observados"
                  analysis={analysis.comportamentos_observados}
                  color="bg-amber-200"
                />
              </section>

              <section className="py-3">
                <InsightCard
                  title="Gatilhos de Consumo"
                  analysis={analysis.gatilhos_de_consumo}
                  color="bg-red-200"
                />
              </section>

              <section className="py-3">
                <InsightCard
                  title="Recomendações Práticas"
                  analysis={analysis.recomendações_práticas}
                  color="bg-emerald-200"
                />
              </section>

              <section className="py-3">
                <InsightCard
                  title="Melhorias Sugeridas"
                  analysis={analysis.melhorias_sugeridas}
                  color="bg-purple-200"
                />
              </section>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
