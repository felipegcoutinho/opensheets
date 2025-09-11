import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-2 w-full rounded" />
        <div className="mt-2 flex justify-between text-xs">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <BudgetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
