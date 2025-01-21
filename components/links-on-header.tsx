"use client";

import { UseDates } from "@/hooks/use-dates";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import NavigationLinks from "./navigation-links";

function LinkOnHeader({ session }) {
  const { currentMonthName, currentYear } = UseDates();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isHomePage = pathname === "/";

  let month =
    searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  if (!session || isHomePage) return null;

  const links = NavigationLinks({
    month,
    userEmail: session.email,
  });

  return (
    <nav className="hidden md:block">
      <div className="flex w-full items-center justify-center">
        <Suspense>
          {links.map(({ href, Icon, name, path }) => (
            <Link key={href} href={href}>
              <LinkNavButton
                Icon={Icon}
                LinkName={name}
                isActive={pathname === path}
              />
            </Link>
          ))}
        </Suspense>
      </div>
    </nav>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName, isActive }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 rounded-full px-4 lowercase transition-colors duration-200",
        isActive
          ? "text-color-6 underline decoration-2 underline-offset-8"
          : "text-color-2 hover:text-color-2 dark:text-neutral-300",
      )}
    >
      <Icon size={14} />
      {LinkName}
    </div>
  );
}
