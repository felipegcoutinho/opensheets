import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mt-4">
      <Skeleton className="h-screen" />
    </div>
  );
}
