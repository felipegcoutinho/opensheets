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
    <Card className={`my-4 border-none p-6 ${className}`}>{children}</Card>
  );
}

export default Banner;
