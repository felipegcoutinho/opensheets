"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Card } from "./ui/card";

function CardBanner({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <Card className="mx-auto mb-4 w-full border-none bg-gradient-to-tr from-alt_yellow to-alt_violet px-4 py-8 dark:bg-blue-950 dark:from-alt_green/40 dark:to-alt_violet/20">
      <div className="flex items-center justify-between">{children}</div>
    </Card>
  );
}

export default CardBanner;
