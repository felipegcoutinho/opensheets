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
    <Card className="w-full px-6 py-8 mb-2 text-black dark:text-white">
      <div className="flex justify-between items-center">{children}</div>
    </Card>
  );
}

export default CardBanner;
