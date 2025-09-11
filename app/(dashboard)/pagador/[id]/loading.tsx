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

function PayerHeaderSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="mt-2">
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </Card>
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-32" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-2 w-full rounded" />
          <div className="flex flex-wrap gap-3 text-xs">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </Card>
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-2 h-32 w-full" />
      </Card>
    </div>
  );
}

function SummaryCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function Loading() {
  return (
    <section className="space-y-4">
      <MonthPickerSkeleton />
      <PayerHeaderSkeleton />
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <TransactionsTableSkeleton />
    </section>
  );
}
