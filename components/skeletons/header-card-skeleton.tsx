export default function HeaderCardSkeleton() {
  return (
    <div className="mt-2 w-full animate-pulse rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded bg-accent" />
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-accent" />
            <div className="h-3 w-32 rounded bg-accent" />
          </div>
        </div>
        <div className="h-10 w-16 rounded bg-accent" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border p-4">
          <div className="h-3 w-20 rounded bg-accent" />
          <div className="mt-2 h-6 w-24 rounded bg-accent" />
        </div>
        <div className="rounded border p-4">
          <div className="h-3 w-20 rounded bg-accent" />
          <div className="mt-2 h-6 w-24 rounded bg-accent" />
        </div>
        <div className="rounded border p-4">
          <div className="h-3 w-20 rounded bg-accent" />
          <div className="mt-2 h-6 w-24 rounded bg-accent" />
        </div>
      </div>
    </div>
  );
}

