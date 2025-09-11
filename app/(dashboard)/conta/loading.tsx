import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AccountCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <AccountCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
