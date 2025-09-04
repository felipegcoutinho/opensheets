export default function CalendarSkeleton() {
  return (
    <div className="mt-2 w-full">
      <div className="skeleton mb-3 h-6 w-1/3 rounded" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`h-${i}`} className="skeleton h-5 rounded" />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded" />
        ))}
      </div>
    </div>
  );
}
