"use client";

import { usePathname } from "next/navigation";

function Banner({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return <div className="mb-4 w-full dark:text-white">{children}</div>;
}

export default Banner;
