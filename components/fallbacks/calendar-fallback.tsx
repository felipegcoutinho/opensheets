import { Card } from "@/components/ui/card";
import { TextSkeleton, TitleSkeleton } from "@/components/ui/micro-skeletons";

export default function CalendarFallback() {
  return (
    <Card className="p-4">
      <div className="mb-3 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <TextSkeleton key={`h-${i}`} className="h-4 w-12" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="space-y-1 rounded-md border p-2">
            <TitleSkeleton className="h-4 w-6" />
            <div className="space-y-1">
              <TextSkeleton className="w-full" />
              <TextSkeleton className="w-10" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

