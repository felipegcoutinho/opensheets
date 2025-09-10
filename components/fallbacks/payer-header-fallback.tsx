import { Card } from "@/components/ui/card";
import {
  TitleSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  ProgressSkeleton,
  MiniChartSkeleton,
} from "@/components/ui/micro-skeletons";

export default function PayerHeaderFallback() {
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      {/* Card Pagador */}
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <div className="h-4 w-4 rounded bg-muted-foreground/20" />
            <TextSkeleton className="w-16" />
          </div>
          <ButtonSkeleton className="h-7 w-24" />
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2">
            <TitleSkeleton className="w-48" />
            <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
            <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TextSkeleton className="w-56" />
            <div className="h-5 rounded bg-muted-foreground/15 px-2" style={{ width: 180 }} />
          </div>
        </div>
        <div className="mt-3">
          <ButtonSkeleton className="w-36" />
        </div>
      </Card>

      {/* Card Total no mês */}
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <TextSkeleton className="w-24" />
        <div className="mt-2 h-7 w-40 rounded bg-muted-foreground/30" />
        <ProgressSkeleton />
      </Card>

      {/* Últimos 6 meses */}
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <TextSkeleton className="w-28" />
        <MiniChartSkeleton />
      </Card>
    </div>
  );
}

