"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

export const NavProjects = memo(function NavProjects({
  projects,
  title = "Menu",
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium text-neutral-500">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="mt-1">
        {projects.map((item) => {
          const isActive = pathname.startsWith(item.url.split("?")[0]);

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 capitalize transition-all ${
                    isActive
                      ? "text-blue-600 hover:bg-blue-700"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                  } `}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-blue-600" : "text-black"
                    }`}
                  />
                  <span className="truncate font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});
