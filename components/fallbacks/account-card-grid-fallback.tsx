import { Card } from "@/components/ui/card";
import { CircleSkeleton, TextSkeleton, TitleSkeleton, RowItemSkeleton } from "@/components/ui/micro-skeletons";

export default function AccountCardGridFallback({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <CircleSkeleton size={40} />
            <div className="flex flex-col gap-1">
              <TitleSkeleton className="w-40" />
              <TextSkeleton className="w-28" />
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            <RowItemSkeleton />
            <RowItemSkeleton />
            <RowItemSkeleton />
          </div>
        </Card>
      ))}
    </div>
  );
}

