"use client";

import { usePathname } from "next/navigation";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }

  return (
    <div className="mx-auto my-4 w-full rounded bg-violet-100 px-4 py-10 dark:bg-violet-950">
      {children}
    </div>
  );
}

export default CardBanner;
