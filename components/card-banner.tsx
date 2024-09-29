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
    <Card className="px-6 py-8 bg-neutral-100 dark:bg-emerald-950 border-none text-cyan-950 w-full mb-2 dark:text-white">
      <div className="flex justify-between items-center">{children}</div>
    </Card>
  );
}

export default CardBanner;
