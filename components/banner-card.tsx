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
    <Card className="mb-4 w-full bg-primary-color px-4 py-10 text-black dark:bg-primary-color/20">
      {children}
    </Card>
  );
}

export default Banner;
