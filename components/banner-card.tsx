"use client";

import { usePathname } from "next/navigation";

function Banner({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <div className="mb-4 w-full text-color-2 dark:text-white">{children}</div>
  );
}

export default Banner;
