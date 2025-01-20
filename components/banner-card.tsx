"use client";

import { usePathname } from "next/navigation";

function Banner({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <div className="text-color-1 mb-4 w-full dark:from-transparent dark:to-transparent dark:text-white">
      {children}
    </div>
  );
}

export default Banner;
