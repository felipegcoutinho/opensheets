import { KpiFallback, WidgetCardFallback } from "@/components/fallbacks/widget-fallback";

export default function Loading() {
  return (
    <>
      {/* KPIs com micro-skeleton */}
      <div className="mt-4">
        <KpiFallback />
      </div>

      {/* Chart + Faturas + Boletos (cards) */}
      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <WidgetCardFallback />
        <WidgetCardFallback />
        <WidgetCardFallback />
      </div>

      {/* Lançamentos Recentes + Resumo do Mês */}
      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-2">
        <WidgetCardFallback />
        <WidgetCardFallback />
      </div>

      {/* ConditionList + PaymentList + Categorias */}
      <div className="my-2 mb-10 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <WidgetCardFallback />
        <WidgetCardFallback />
        <WidgetCardFallback />
        <WidgetCardFallback />
      </div>
    </>
  );
}
