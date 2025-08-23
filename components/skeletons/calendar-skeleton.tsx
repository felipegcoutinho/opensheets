export default function CalendarSkeleton() {
  return (
    <div className="mt-2 w-full animate-pulse">
      <div className="mb-3 h-8 w-1/3 rounded bg-accent" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`h-${i}`} className="h-6 rounded bg-accent/80" />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="h-20 rounded border bg-accent/50" />
        ))}
      </div>
    </div>
  );
}

