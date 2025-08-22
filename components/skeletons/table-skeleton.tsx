export default function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-2 h-8 w-1/3 rounded bg-accent" />
      <div className="overflow-hidden rounded border">
        <div className="h-10 bg-accent" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 border-t bg-accent/60" />
        ))}
      </div>
    </div>
  );
}
