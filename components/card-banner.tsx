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
    <Card className="mx-auto mb-4 w-full bg-gradient-to-br from-lusty-lavender from-10% to-onsen px-4 py-10 dark:bg-gradient-to-br dark:from-foggy-amethyst dark:to-blue-950">
      {children}
    </Card>
  );
}

export default CardBanner;
