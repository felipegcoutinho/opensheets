import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function WidgetSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-7 w-32" />
          </Card>
        ))}
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <WidgetSkeleton key={i} />
        ))}
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <WidgetSkeleton key={i} />
        ))}
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <WidgetSkeleton key={i} lines={3} />
        ))}
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <WidgetSkeleton key={i} lines={3} />
        ))}
      </div>
    </section>
  );
}
