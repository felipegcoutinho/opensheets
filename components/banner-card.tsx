"use client";

import { usePathname } from "next/navigation";
import { Card } from "./ui/card";

type BannerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Banner({ children, className }: BannerProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <Card className={`bg-secondary mb-2 p-6 ${className}`}>{children}</Card>
  );
}
