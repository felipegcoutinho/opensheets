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
  links,
  cartoes,
  contas,
  categorias,
  title = "Menu",
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground text-sm">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="mt-1">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.url.split("?")[0]);

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                className={`${isActive && "bg-muted-foreground/5"}`}
                asChild
              >
                <div className="flex w-full items-center justify-between px-3 py-5">
                  <Link
                    href={item.url}
                    className={`flex items-center gap-2 transition-all ${
                      isActive
                        ? "text-foreground font-bold"
                        : "text-accent-foreground"
                    } `}
                  >
                    <item.icon
                      className={`h-4.5 w-4.5 ${
                        isActive
                          ? "var(--foreground)"
                          : "var(--muted-foreground)"
                      } }`}
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
  );
});
