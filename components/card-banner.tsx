"use client";

import { usePathname } from "next/navigation";
import { Card } from "./ui/card";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }

  return (
    <Card className="mx-auto mb-4 w-full border-none bg-gradient-to-tr from-alt_yellow to-alt_violet px-4 py-8 dark:bg-blue-950 dark:from-alt_green/40 dark:to-alt_violet/20">
      {children}
    </Card>
  );
}

export default CardBanner;
