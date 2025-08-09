"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-md ${className}`} />;
}

export function AnalysisSkeleton({ month }: { month: string }) {
  return (
    <Card className="w-full border-none">
      <CardHeader className="space-y-2 p-0">
        <CardTitle className="text-xl">
          Montando seu relatório inteligente…
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Estamos sintetizando padrões, gatilhos e recomendações para o período{" "}
          {month}.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}
