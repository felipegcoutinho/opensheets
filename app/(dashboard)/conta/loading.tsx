import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AccountCardSkeleton() {
  return (
    <Card className="group">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[42px] w-[42px] rounded" />
          <CardTitle className="capitalize">
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-muted-foreground text-sm">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-1 text-2xl font-semibold">
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="text-muted-foreground mt-1 text-xs capitalize">
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="mt-6 flex items-center gap-6">
          <Skeleton className="h-8 w-24 rounded-md" />
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
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <AccountCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
