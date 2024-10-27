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
    <Card className="from-lusty-lavender to-onsen dark:from-foggy-amethyst mx-auto mb-4 w-full bg-gradient-to-br from-30% px-4 py-10 dark:bg-gradient-to-br dark:to-blue-950">
      {children}
    </Card>
  );
}

export default CardBanner;
