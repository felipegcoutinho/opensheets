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
    <Card className="px-6 py-8 bg-gradient-to-bl from-emerald-200 via-green-500 to-orange-200 dark:bg-stone-800 w-full mb-2 dark:text-white">
      <div className="flex justify-between items-center">{children}</div>
    </Card>
  );
}

export default CardBanner;
