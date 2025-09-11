import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="border p-2">
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-3 w-4" />
              <Skeleton className="h-3 w-10" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
