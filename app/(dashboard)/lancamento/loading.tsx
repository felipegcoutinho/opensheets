import { Skeleton } from "@/components/ui/skeleton";
import TransactionsTableSkeleton from "@/components/skeletons/transactions-table";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <TransactionsTableSkeleton />
    </div>
  );
}
