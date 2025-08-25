"use client";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { UseDates } from "@/hooks/use-dates";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import Logo from "../logo";
import { NavLinks } from "./nav-links";

export function AppSidebar({
  username,
  usermail,
  cartoes,
  contas,
  categorias,
  ...props
}: React.ComponentProps<typeof Sidebar> & {}) {
  const searchParams = useSearchParams();
  const { formatted_current_month } = UseDates();

  let month = searchParams.get("periodo") || formatted_current_month;

  const data = NavLinks(month);

  return (
    <Sidebar collapsible="sidebar" {...props} variant="inset">
      <SidebarHeader>
        <div className="mt-4 flex items-center justify-center gap-2 py-2">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarContent>
          <NavProjects
            groups={data.groups}
            cartoes={cartoes}
            contas={contas}
            categorias={categorias}
          />
        </SidebarContent>
      </SidebarContent>
      <SidebarFooter className="border-border border-t">
        <NavUser username={username} usermail={usermail} user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
