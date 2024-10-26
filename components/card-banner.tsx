"use client";

import { usePathname } from "next/navigation";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }

  return (
    <div className="from-lusty-lavender to-foggy-amethyst dark:to-lost-in-sadness mx-auto mb-4 w-full rounded bg-gradient-to-tr px-4 py-10 dark:from-violet-900">
      {children}
    </div>
  );
}

export default CardBanner;
