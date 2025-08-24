export default function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-accent mb-2 h-8 w-1/3 rounded" />
      <div className="overflow-hidden rounded border">
        <div className="bg-accent h-10" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-accent/60 h-10 border-t" />
        ))}
      </div>
    </div>
  );
}
