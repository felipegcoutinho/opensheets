"use client";

import { usePathname } from "next/navigation";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }

  return <div className="mx-auto w-full py-4">{children}</div>;
}

export default CardBanner;
