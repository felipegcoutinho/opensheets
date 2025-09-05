export default function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full">
      <div className="skeleton mb-2 h-6 w-1/3 rounded" />
      <div className="overflow-hidden rounded-lg">
        <div className="skeleton h-8" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-8" />
        ))}
      </div>
    </div>
  );
}
