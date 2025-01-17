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
    <Card className="mb-4 w-full bg-gradient-to-r from-primary-color to-tertiary-color px-4 py-10 text-black dark:from-transparent dark:to-transparent dark:text-white">
      {children}
    </Card>
  );
}

export default Banner;
