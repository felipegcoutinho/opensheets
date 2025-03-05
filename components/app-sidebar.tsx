"use client";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ArrowRightLeft,
  AudioWaveform,
  Command,
  CreditCard,
  GalleryVerticalEnd,
  LayoutDashboard,
  Pen,
  PiggyBank,
  Users,
} from "lucide-react";
import * as React from "react";

// This is sample data.
const data = {
  user: {
    name: "Felipe Coutinho",
    email: "m@example.com",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  projects: [
    {
      name: "dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "lançamentos",
      url: "/lancamentos",
      icon: ArrowRightLeft,
    },
    {
      name: "cartões",
      url: "/cartao",
      icon: CreditCard,
    },
    {
      name: "contas",
      url: "/conta",
      icon: PiggyBank,
    },
    {
      name: "responsáveis",
      url: "/responsavel",
      icon: Users,
    },
    {
      name: "anotações",
      url: "/anotacao",
      icon: Pen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
