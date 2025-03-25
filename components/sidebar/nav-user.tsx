"use client";

import { LogOut, MoreVerticalIcon } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import PrivacyButton from "../privacy-button";

export function NavUser({
  user,
  username,
  usermail,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  username: string;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{username}</span>
                <span className="truncate text-xs">{usermail}</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{username}</span>
                  <span className="truncate text-xs">{usermail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Configurações do Usuário */}
            <DropdownMenuGroup>
              <div className="px-2 py-1.5">
                <span className="text-muted-foreground text-xs font-medium">
                  Configurações
                </span>
              </div>

              {/* <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm">Tema</span>
                <div className="flex h-9 w-9 items-center justify-center">
                  <ModeToggle />
                </div>
              </div> */}

              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm">Valores Visíveis</span>
                <div className="flex w-9 items-center justify-center">
                  <PrivacyButton />
                </div>
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <div className="p-1">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </form>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
