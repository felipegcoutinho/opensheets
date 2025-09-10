"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextSkeleton, TitleSkeleton, RowItemSkeleton } from "@/components/ui/micro-skeletons";

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
      <CardContent className="space-y-4 p-0">
        <div>
          <TitleSkeleton className="w-40" />
          <div className="mt-2 space-y-2">
            <RowItemSkeleton />
            <RowItemSkeleton />
            <RowItemSkeleton />
          </div>
        </div>
        <div>
          <TitleSkeleton className="w-48" />
          <div className="mt-2 space-y-2">
            <TextSkeleton className="w-full" />
            <TextSkeleton className="w-3/4" />
            <TextSkeleton className="w-5/6" />
          </div>
        </div>
        <div>
          <TitleSkeleton className="w-44" />
          <div className="mt-2 space-y-2">
            <RowItemSkeleton />
            <RowItemSkeleton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
