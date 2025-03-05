"use client";

import { UseDates } from "@/hooks/use-dates";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import NavigationLinks from "./navigation-links";

function LinkOnHeader({ session }) {
  const { currentMonthName, currentYear } = UseDates();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!session) return null;

  let month =
    searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  const links = NavigationLinks({
    month,
    userEmail: session.email,
  });

  return (
    <nav className="hidden md:block">
      <div className="rounded-full px-1 py-1">
        <div className="flex items-center">
          {links.map(({ href, Icon, name, path }) => (
            <Link key={href} href={href}>
              <LinkNavButton
                Icon={Icon}
                LinkName={name}
                isActive={pathname === path}
              />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default LinkOnHeader;

export function LinkNavButton({ Icon, LinkName, isActive }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium lowercase transition-colors duration-200",
        isActive
          ? "bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white"
          : "text-muted-foreground hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
      )}
    >
      <Icon size={14} />
      {LinkName}
    </div>
  );
}
