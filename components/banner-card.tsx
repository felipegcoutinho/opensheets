"use client";

import { usePathname } from "next/navigation";

function Banner({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (!isDashboard) {
    return null;
  }

  return (
    <div className="mb-4 w-full text-black dark:from-transparent dark:to-transparent dark:text-white">
      {children}
    </div>
  );
}

export default Banner;
