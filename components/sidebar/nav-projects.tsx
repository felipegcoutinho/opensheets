"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

export const NavProjects = memo(function NavProjects({
  projects,
  title = "Menu",
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  title?: string;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 rounded-lg px-3 py-4 transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-gray-200 font-medium"
                      : "text-gray-600 hover:bg-orange-100/60"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-primary" : "text-black"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});
