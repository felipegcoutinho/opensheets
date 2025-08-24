export default function PayerHeaderSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {/* Card esquerdo: dados do pagador */}
      <div className="col-span-4 animate-pulse rounded border p-4 sm:col-span-2 lg:col-span-1">
        <div className="mb-3 h-4 w-20 rounded bg-accent" />
        <div className="mt-2 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-accent" />
          <div className="h-5 w-40 rounded bg-accent" />
        </div>
        <div className="mt-2 h-3 w-56 rounded bg-accent" />
        <div className="mt-3 h-8 w-28 rounded bg-accent" />
      </div>

      {/* Card direito: total + barras */}
      <div className="col-span-4 animate-pulse rounded border p-4 sm:col-span-2 lg:col-span-3">
        <div className="mb-2 h-3 w-24 rounded bg-accent" />
        <div className="h-8 w-40 rounded bg-accent" />
        <div className="mt-3 h-2 w-full rounded bg-accent" />
        <div className="mt-2 flex gap-3">
          <div className="h-3 w-24 rounded bg-accent" />
          <div className="h-3 w-24 rounded bg-accent" />
          <div className="h-3 w-40 rounded bg-accent" />
        </div>
      </div>
    </div>
  );
}

