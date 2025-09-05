export default function HeaderCardSkeleton() {
  return (
    <div className="mt-2 w-full rounded-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="skeleton h-12 w-12 rounded" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-3 w-32 rounded" />
          </div>
        </div>
        <div className="skeleton h-8 w-16 rounded" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded p-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton mt-2 h-5 w-24 rounded" />
        </div>
        <div className="rounded p-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton mt-2 h-5 w-24 rounded" />
        </div>
        <div className="rounded p-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton mt-2 h-5 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
