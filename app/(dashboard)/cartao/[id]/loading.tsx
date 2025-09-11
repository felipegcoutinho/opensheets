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

function StatusIndicatorSkeleton() {
  return (
    <Card className="my-3 flex flex-row items-center gap-3 p-4">
      <div className="h-5 w-5 rounded bg-muted-foreground/20" />
      <div className="flex flex-col">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-1 h-3 w-32" />
      </div>
    </Card>
  );
}

function CardInfoSkeleton() {
  return (
    <Card className="mt-2 w-full gap-2 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-14 w-14 rounded" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
        <Card className="gap-0 p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-1 h-4 w-20" />
          <Skeleton className="mt-3 h-3 w-20" />
          <Skeleton className="mt-1 h-4 w-16" />
          <Skeleton className="mt-3 h-3 w-20" />
          <Skeleton className="mt-1 h-4 w-16" />
        </Card>
        <Card className="gap-0 p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-1 h-4 w-24" />
          <Skeleton className="mt-3 h-3 w-24" />
          <Skeleton className="mt-1 h-4 w-24" />
          <Skeleton className="mt-3 h-3 w-20" />
          <div className="mt-1 flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </Card>
        <Card className="flex flex-col items-start justify-center gap-2 p-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-32 rounded" />
        </Card>
      </div>
    </Card>
  );
}

export default function Loading() {
  return (
    <section className="space-y-4">
      <MonthPickerSkeleton />
      <StatusIndicatorSkeleton />
      <CardInfoSkeleton />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
      <TransactionsTableSkeleton />
    </section>
  );
}
