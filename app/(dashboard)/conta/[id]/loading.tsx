import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AccountHeaderSkeleton() {
  return (
    <Card className="mt-2 w-full p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-32" />
          </Card>
        ))}
      </div>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-t py-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="ml-auto h-4 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <section className="space-y-4">
      <div className="flex justify-start">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <AccountHeaderSkeleton />

      <TableSkeleton />
    </section>
  );
}
