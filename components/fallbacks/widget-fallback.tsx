import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RowItemSkeleton, TextSkeleton, TitleSkeleton } from "@/components/ui/micro-skeletons";

export function KpiFallback() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4">
          <TextSkeleton className="w-16" />
          <div className="mt-2 h-7 w-32 rounded bg-muted-foreground/30" />
        </Card>
      ))}
    </div>
  );
}

export function WidgetCardFallback() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <TitleSkeleton className="w-28" />
          <div className="flex items-center gap-2">
            <TextSkeleton className="w-16" />
            <TextSkeleton className="w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <RowItemSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

