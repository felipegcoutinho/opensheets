"use client";

import { usePathname } from "next/navigation";
import { Card } from "./ui/card";

function Banner({ children, className }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <Card className={`mt-4 border-none px-6 py-4 ${className}`}>
      {children}
    </Card>
  );
}

export default Banner;
