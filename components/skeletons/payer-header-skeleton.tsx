export default function PayerHeaderSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {/* Card esquerdo: dados do pagador */}
      <div className="col-span-4 rounded p-4 sm:col-span-2 lg:col-span-1">
        <div className="skeleton mb-3 h-4 w-20 rounded" />
        <div className="mt-2 flex items-center gap-2">
          <div className="skeleton h-6 w-6 rounded-full" />
          <div className="skeleton h-5 w-40 rounded" />
        </div>
        <div className="skeleton mt-2 h-3 w-56 rounded" />
        <div className="skeleton mt-3 h-8 w-28 rounded" />
      </div>

      {/* Card direito: total + barras */}
      <div className="col-span-4 rounded p-4 sm:col-span-2 lg:col-span-3">
        <div className="skeleton mb-2 h-3 w-24 rounded" />
        <div className="skeleton h-7 w-40 rounded" />
        <div className="skeleton mt-3 h-2 w-full rounded" />
        <div className="mt-2 flex gap-3">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-3 w-40 rounded" />
        </div>
      </div>
    </div>
  );
}
