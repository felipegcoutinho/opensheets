"use client";

import { usePathname } from "next/navigation";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }

  return <div className="mx-auto w-full py-4">{children}</div>;

  // <div className="animated-background flex w-full items-center justify-start rounded bg-gradient-to-r from-blue-100 via-orange-500 to-green-500 p-4 text-white dark:text-white">
}

export default CardBanner;
