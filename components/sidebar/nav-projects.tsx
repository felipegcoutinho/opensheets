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
import AddButton from "./add-button";

export const NavProjects = memo(function NavProjects({
  groups,
  cartoes,
  contas,
  categorias,
}: {
  groups: {
    title: string;
    items: {
      name: string;
      url: string;
      icon: React.ElementType;
    }[];
  }[];
  cartoes: any;
  contas: any;
  categorias: any;
}) {
  const pathname = usePathname();

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="text-xs">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname.startsWith(item.url.split("?")[0]);

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    className={`${isActive && "bg-foreground/10"}`}
                    asChild
                  >
                    <div className="flex w-full items-center justify-between px-4 py-4">
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 transition-all ${
                          isActive ? "font-bold" : "font-normal"
                        }`}
                      >
                        <item.icon
                          className={`h-4.5 w-4.5 ${
                            isActive ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <p>{item.name}</p>
                      </Link>
                      <AddButton
                        cartoes={cartoes}
                        contas={contas}
                        categorias={categorias}
                        item={item}
                      />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
});
