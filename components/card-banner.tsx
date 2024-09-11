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
    <Card className="px-6 py-8 bg-gradient-to-tl from-violet-100 dark:from-blue-900 via-emerald-400 dark:via-emerald-900 to-orange-300 dark:to-orange-800 w-full mb-2 dark:text-white">
      <div className="flex justify-between items-center">{children}</div>
    </Card>
  );
}

export default CardBanner;
