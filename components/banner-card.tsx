"use client";

import { usePathname } from "next/navigation";
import { Card } from "./ui/card";

function Banner({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <Card className="mb-4 w-full bg-primary-color px-4 py-10 text-amber-950 dark:bg-tertiary-color/30 dark:text-white">
      {children}
    </Card>
  );
}

export default Banner;
