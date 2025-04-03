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
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import Logo from "../logo";
import { getData } from "./nav-links";

export function AppSidebar({
  username,
  usermail,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: any }) {
  const { open } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const { currentMonthName, currentYear } = UseDates();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let month =
    searchParams.get("periodo") || `${currentMonthName}-${currentYear}`;

  const data = getData(month);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {open ? <Logo /> : <span className="text-black">OP</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />

        <Link href="/criar-lancamentos" className="your-class-name">
          Your Link Text
        </Link>

        {/*<SidebarMenuItem className="mt-auto mb-6 space-y-2 px-3 group-data-[collapsible=icon]:hidden">
         <SidebarMenuButton asChild>
            <label>
              <Eye />
              <span>Valores Visíveis</span>
              <PrivacyButton />
            </label>
          </SidebarMenuButton>

        <SidebarMenuButton asChild>
            <label>
              <Palette />
              <span>Dark Mode</span>
              {mounted && (
                <Switch
                  className="ml-auto"
                  checked={resolvedTheme !== "light"}
                  onCheckedChange={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                />
              )}
            </label>
          </SidebarMenuButton> 
        </SidebarMenuItem>*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser username={username} usermail={usermail} user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
