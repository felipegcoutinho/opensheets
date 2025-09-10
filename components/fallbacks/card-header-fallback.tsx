import { Card } from "@/components/ui/card";
import {
  BarSkeleton,
  CardHeaderLine,
  StatSkeleton,
  ButtonSkeleton,
} from "@/components/ui/micro-skeletons";

export default function CardHeaderFallback() {
  return (
    <div className="space-y-3">
      {/* Indicador de status */}
      <Card className="flex-row items-center gap-3 border-none bg-muted/60 p-4">
        <div className="h-5 w-5 rounded-full bg-muted-foreground/20" aria-hidden />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-40 rounded bg-muted-foreground/15" />
          <div className="h-3 w-32 rounded bg-muted-foreground/10" />
        </div>
      </Card>

      {/* CardInfo */}
      <Card className="gap-4 p-6">
        <CardHeaderLine />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="gap-0 p-4">
            <StatSkeleton />
            <div className="mt-3 space-y-2">
              <div className="h-2 w-16 rounded bg-muted-foreground/20" />
              <div className="h-4 w-20 rounded bg-muted-foreground/30" />
              <div className="h-2 w-16 rounded bg-muted-foreground/20" />
              <div className="h-4 w-20 rounded bg-muted-foreground/30" />
            </div>
          </Card>

          <Card className="gap-0 p-4">
            <div className="space-y-3">
              <StatSkeleton />
              <div className="space-y-2">
                <div className="h-2 w-20 rounded bg-muted-foreground/20" />
                <div className="h-4 w-36 rounded bg-muted-foreground/30" />
                <div className="h-2 w-12 rounded bg-muted-foreground/20" />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 rounded bg-muted-foreground/20" />
                  <div className="h-4 w-16 rounded bg-muted-foreground/30" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col items-start justify-center gap-3 p-4">
            <div className="h-2 w-24 rounded bg-muted-foreground/20" />
            <div className="h-7 w-32 rounded bg-muted-foreground/30" />
            <ButtonSkeleton className="w-40" />
          </Card>
        </div>
      </Card>
    </div>
  );
}

