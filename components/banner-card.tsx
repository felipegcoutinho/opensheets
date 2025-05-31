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
    <Card className="dark:bg-card mt-4 border-none bg-blue-50 px-6 py-4">
      {children}
    </Card>
  );
}

export default Banner;
