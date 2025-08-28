import { getUserSession } from "@/app/actions/users/fetch_users";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import AuthButton from "./auth-button";
import Logo from "./logo";

import HeaderBlur from "./header-blur";
import { RiDashboardLine } from "@remixicon/react";

export default async function Header() {
  const session = await getUserSession();

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4">
        <HeaderBlur />
        {/* Logo sempre visível */}
        <div className="shrink-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Menu e ação à direita */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/#sobre" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Sobre
            </Link>
            <Link href="/#solucoes" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Soluções
            </Link>
            <Link href="/#contato" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Contato
            </Link>
          </nav>
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-2 shadow-sm">
                <RiDashboardLine className="size-4" />
                Ir para Dashboard
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
