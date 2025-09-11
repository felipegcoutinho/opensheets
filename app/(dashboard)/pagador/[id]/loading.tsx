import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function HeaderGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      {/* Card: Pagador */}
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <Skeleton className="h-6 w-52" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-5 w-48 rounded" />
          </div>
        </div>
        <div className="mt-3">
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </Card>

      {/* Card: Total no mês */}
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-8 w-40" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-2 w-full" />
          <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </Card>

      {/* Card: Últimos 6 meses (gráfico) */}
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-3 h-32 w-full" />
      </Card>
    </div>
  );
}

function SectionSummarySkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="mt-3 space-y-3">
            {Array.from({ length: 3 }).map((_, r) => (
              <div key={r} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="ml-auto h-4 w-20" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-t py-3">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <section className="space-y-4">
      <h1 className="sr-only">Resumo do pagador</h1>

      <div className="flex justify-start">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <HeaderGridSkeleton />

      <SectionSummarySkeleton />

      <div>
        <TableSkeleton />
      </div>
    </section>
  );
}
