"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function AnalysisSkeleton({ month }: { month: string }) {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Montando seu relatório inteligente…</CardTitle>
        <p className="text-sm text-muted-foreground">
          Estamos sintetizando padrões, gatilhos e recomendações para o período {month}.
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
  );
}
