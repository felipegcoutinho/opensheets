"use client";

import { usePathname } from "next/navigation";

function Banner({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return <div className="my-2 w-full px-4 dark:text-white">{children}</div>;
}

export default Banner;
