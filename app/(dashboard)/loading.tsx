import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      {/* CardSummary Skeletons */}
      <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      {/* Chart + Faturas + Boletos */}
      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>

      {/* Lançamentos Recentes + Resumo do Mês */}
      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>

      {/* ConditionList + PaymentList + Categorias */}
      <div className="my-2 mb-10 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </>
  );
}
