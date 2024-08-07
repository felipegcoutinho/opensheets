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
    <Card className="px-6 py-10 bg-violet-100 dark:bg-orange-950 w-full mb-2">
      <div className="flex justify-between items-center">{children}</div>
    </Card>
  );
}

export default CardBanner;
