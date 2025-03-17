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
import * as React from "react";
import Logo from "../logo";
import { getData } from "./nav-links";

export function AppSidebar({
  username,
  usermail,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: any }) {
  const { open } = useSidebar();

  const data = getData();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center border-b border-gray-200">
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
