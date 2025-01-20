"use client";

import { UseDates } from "@/hooks/use-dates";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import NavigationLinks from "./navigation-links";
import { SheetContent } from "./ui/sheet";

export default function LinksOnMobile({ session }) {
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
    <SheetContent side="left" className="w-72">
      <nav className="flex flex-col gap-4 pt-10">
        {session &&
          links.map(({ href, Icon, name }) => (
            <Link key={href} href={href}>
              <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-neutral-100">
                <Icon className="h-4 w-4" />
                <span>{name}</span>
              </div>
            </Link>
          ))}
      </nav>
    </SheetContent>
  );
}
