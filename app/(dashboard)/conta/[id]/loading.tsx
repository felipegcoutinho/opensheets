import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionsTableSkeleton from "@/components/skeletons/transactions-table";

function MonthPickerSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}

function AccountInfoSkeleton() {
  return (
    <Card className="mt-2 w-full p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card className="p-4" key={i}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-5 w-24" />
          </Card>
        ))}
      </div>
    </Card>
  );
}

export default function Loading() {
  return (
    <section className="space-y-4">
      <MonthPickerSkeleton />
      <AccountInfoSkeleton />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <TransactionsTableSkeleton />
    </section>
  );
}
