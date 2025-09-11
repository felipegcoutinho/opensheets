import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function NoteCardSkeleton() {
  return (
    <Card className="flex h-[350px] flex-col justify-between">
      <CardHeader className="shrink-0">
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="mx-4 flex-1 overflow-hidden rounded bg-neutral-50 p-2 dark:bg-transparent">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-3 w-full last:mb-0" />
        ))}
      </CardContent>
      <CardFooter className="shrink-0">
        <div className="flex gap-4 text-sm">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
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
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
