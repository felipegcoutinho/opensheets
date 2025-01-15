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
    <Card className="mb-4 w-full bg-gradient-to-r from-primary-color to-tertiary-color px-4 py-12 text-black dark:bg-gradient-to-r dark:from-black dark:to-black dark:text-white">
      {children}
    </Card>
  );
}

export default Banner;
