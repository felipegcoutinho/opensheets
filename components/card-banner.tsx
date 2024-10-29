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
    <Card className="from-alt_yellow to-alt_violet mx-auto mb-4 w-full border-none bg-gradient-to-tr px-4 py-8 dark:bg-blue-950 dark:bg-gradient-to-tr">
      {children}
    </Card>
  );
}

export default CardBanner;
