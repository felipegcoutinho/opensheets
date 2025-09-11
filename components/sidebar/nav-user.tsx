"use client";

import { RiLogoutBoxLine, RiMoreLine } from "@remixicon/react";

import { signOut } from "@/app/actions/auth/auth";
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
import { ModeToggle } from "../darkmode-button";
import PrivacyButton from "../privacy-button";

export function NavUser({
  username,
  usermail,
  payerPrincipal,
}: {
  username: string;
  usermail: string;
  payerPrincipal?: { id: string; nome: string; role: string; foto?: string | null } | null;
}) {
  const { isMobile, open } = useSidebar();

  const renderPayerAvatar = () => {
    const foto = payerPrincipal?.foto || undefined;
    if (!payerPrincipal || !foto) return null;
    const resolveFotoSrc = (f?: string) => {
      if (!f) return undefined;
      if (f.startsWith("http")) return f;
      if (f.startsWith("/")) return f;
      return `/avatars/${f}`;
    };
    const src = resolveFotoSrc(foto);
    if (!src) return null;
    return (
      <img
        src={src}
        alt={payerPrincipal?.nome || "Pagador principal"}
        className="size-5 rounded-full object-cover"
      />
    );
  };

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
                <span className="truncate font-bold inline-flex items-center gap-2">
                  {renderPayerAvatar()}
                  {username}
                </span>
                <span className="truncate text-xs">{usermail}</span>
              </div>
              <RiMoreLine className="ml-auto size-4" />
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
                {renderPayerAvatar()}
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

              <div className="flex items-center justify-between p-2">
                <p className="text-sm">Modo Escuro</p>
                <div className="flex items-center justify-center">
                  <ModeToggle />
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <p className="text-sm">Privacidade</p>
                <div className="flex items-center justify-center">
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
                  className="text-destructive flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
                >
                  <RiLogoutBoxLine className="h-4 w-4" />
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
