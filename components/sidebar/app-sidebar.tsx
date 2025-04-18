"use client";

import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { UseDates } from "@/hooks/use-dates";
import { useTheme } from "next-themes";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import Logo from "../logo";
import { NavLinks } from "./nav-links";

export function AppSidebar({
  username,
  usermail,
  ...props
}: React.ComponentProps<typeof Sidebar> & {}) {
  const { open } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentMonthName, currentYear } = UseDates();

  let month =
    searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  const data = NavLinks(month);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-zinc-200">
      <SidebarHeader className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {open ? <Logo /> : <span className="text-black">OP</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser username={username} usermail={usermail} user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
