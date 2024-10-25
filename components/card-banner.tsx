"use client";

import { usePathname } from "next/navigation";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }

  return (
    <div className="mx-auto mb-4 mt-2 w-full rounded bg-violet-100 px-4 py-10">
      {children}
    </div>
  );
}

export default CardBanner;
