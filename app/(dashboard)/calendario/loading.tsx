import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      {/* Barra superior (ex.: MonthPicker) */}
      <div className="flex justify-start">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center p-1">
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>

      {/* Grade do calendário (6 linhas x 7 colunas) */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="flex h-36 flex-col rounded-md border p-2"
          >
            {/* Cabeçalho do dia */}
            <div className="mb-1 flex items-center justify-between">
              <div className="h-5 w-5 rounded-full bg-muted-foreground/20" />
              <Skeleton className="h-2.5 w-10" />
            </div>

            {/* Badges de vencimentos (cartões / boletos) */}
            <div className="mb-1 flex flex-wrap gap-1">
              <div className="flex items-center gap-1 rounded-full border bg-muted/30 px-2 py-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500/40" />
                <Skeleton className="h-2 w-10" />
              </div>
              <div className="flex items-center gap-1 rounded-full border bg-muted/30 px-2 py-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500/40" />
                <Skeleton className="h-2 w-12" />
              </div>
            </div>

            {/* Lista de lançamentos do dia */}
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="ml-auto h-2 w-10" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-28" />
                <Skeleton className="ml-auto h-2 w-12" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="ml-auto h-2 w-8" />
              </div>
            </div>

            {/* Ação de novo lançamento */}
            <Skeleton className="ml-auto mt-1 h-2 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
