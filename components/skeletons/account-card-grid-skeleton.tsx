export default function AccountCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg p-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="skeleton h-10 w-10 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
            <div className="skeleton h-3 w-40 rounded" />
          </div>
          <div className="mt-3 flex justify-between">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-6 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
