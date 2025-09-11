import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PayerCardSkeleton() {
  return (
    <Card className="flex flex-col items-center gap-2 p-4 text-center">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="mt-1 flex items-center justify-center gap-1">
        <Skeleton className="h-4 w-24" />
        <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
        <div className="h-4 w-4 rounded bg-muted-foreground/20" />
      </div>
      <Skeleton className="mt-2 h-8 w-24" />
      <Skeleton className="mt-1 h-6 w-24" />
      <Skeleton className="mt-1 h-8 w-24" />
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
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PayerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
