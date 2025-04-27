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
      <SidebarGroupLabel className="text-muted-foreground text-sm">
        {title}
        <span className="text-2xl">👇</span>
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
                    isActive ? "text-primary" : "text-accent-foreground"
                  } `}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  />
                  <span className="truncate">
                    {item.name}
                    {/* {typeof item.count === "number" && (
                      <span className="ml-2 rounded bg-neutral-200 px-2 py-0.5 text-xs text-neutral-800">
                        {item.count}
                      </span>
                    )} */}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});
