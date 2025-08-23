export default function AccountCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded border p-2">
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded bg-accent" />
              <div className="h-4 w-24 rounded bg-accent" />
            </div>
            <div className="h-4 w-40 rounded bg-accent" />
          </div>
          <div className="flex justify-between px-4 pb-4">
            <div className="h-4 w-16 rounded bg-accent" />
            <div className="h-8 w-20 rounded bg-accent" />
          </div>
        </div>
      ))}
    </div>
  );
}

