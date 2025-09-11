import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function UiCardSkeleton() {
  return (
    <Card className="gap-2">
      <CardContent className="space-y-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-[42px] w-[42px] rounded" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-[36px] w-[36px] rounded-md" />
        </CardTitle>

        <div className="text-muted-foreground mt-4 flex justify-between text-sm">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
        </div>

        <div className="border-y py-4">
          <div className="mb-2 grid grid-cols-3 gap-4 text-base">
            <div className="text-left">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-5 w-28" />
            </div>
            <div className="text-center">
              <Skeleton className="mx-auto h-3 w-20" />
              <span className="mt-2 inline-flex items-center justify-center gap-1">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </span>
            </div>
            <div className="text-right">
              <Skeleton className="ml-auto h-3 w-20" />
              <span className="mt-2 inline-flex items-center justify-end gap-1">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </span>
            </div>
          </div>

          <Skeleton className="h-3 w-full rounded" />
        </div>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </CardFooter>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <UiCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
