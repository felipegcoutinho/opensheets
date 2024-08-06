"use client";
import { usePathname } from "next/navigation";

function CardBanner({ children }) {
  const pathname = usePathname();
  const isNotDashboard = pathname !== "/dashboard";

  if (isNotDashboard) {
    return null;
  }
  return (
    <div className="p-6 bg-transparent w-full">
      <div className="flex justify-between items-center">{children}</div>
    </div>
  );
}

export default CardBanner;
