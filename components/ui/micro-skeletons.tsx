"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type BaseProps = {
  className?: string;
  animate?: boolean;
};

export function TextSkeleton({ className, animate = true }: BaseProps) {
  return <Skeleton data-animate={animate} className={cn("h-3 w-24", className)} />;
}

export function TitleSkeleton({ className, animate = true }: BaseProps) {
  return <Skeleton data-animate={animate} className={cn("h-4 w-32", className)} />;
}

export function CircleSkeleton({ size = 32, className, animate = true }: BaseProps & { size?: number }) {
  return (
    <Skeleton
      data-animate={animate}
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function ButtonSkeleton({ className, animate = true }: BaseProps) {
  return <Skeleton data-animate={animate} className={cn("h-8 w-24 rounded-md", className)} />;
}

export function ChipSkeleton({ className, animate = true }: BaseProps) {
  return <Skeleton data-animate={animate} className={cn("h-5 w-20 rounded-full", className)} />;
}

export function StatSkeleton({ className, animate = true }: BaseProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <TextSkeleton className="h-2 w-16 opacity-70" animate={animate} />
      <Skeleton data-animate={animate} className="h-5 w-24" />
    </div>
  );
}

export function BarSkeleton({ className, animate = true }: BaseProps) {
  return <Skeleton data-animate={animate} className={cn("h-2 w-full rounded", className)} />;
}

export function RowItemSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex min-w-0 items-center gap-2">
        <CircleSkeleton size={20} />
        <TextSkeleton className="w-28" />
      </div>
      <TextSkeleton className="w-16" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-6 items-center gap-3 py-2">
      <TextSkeleton className="col-span-1 w-16" />
      <TextSkeleton className="col-span-2 w-40" />
      <TextSkeleton className="col-span-1 w-24" />
      <TextSkeleton className="col-span-1 w-24" />
      <TextSkeleton className="col-span-1 w-16" />
    </div>
  );
}

export function CardHeaderLine() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CircleSkeleton size={36} />
        <div className="flex flex-col gap-1">
          <TitleSkeleton className="w-40" />
          <TextSkeleton className="w-56" />
        </div>
      </div>
      <Skeleton className="h-10 w-10 rounded" />
    </div>
  );
}

export function MiniChartSkeleton() {
  return (
    <div className="grid grid-cols-6 items-end gap-1 pt-2">
      {[8, 12, 18, 10, 20, 14].map((h, i) => (
        <Skeleton key={i} className="w-full rounded" style={{ height: h * 4 }} />
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="mt-2">
      <BarSkeleton />
      <div className="text-muted-foreground mt-2 flex gap-3 text-xs">
        <TextSkeleton className="w-24" />
        <TextSkeleton className="w-24" />
        <TextSkeleton className="w-36" />
      </div>
    </div>
  );
}

