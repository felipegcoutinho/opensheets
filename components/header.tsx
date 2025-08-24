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

        {/* Área de login/usuário ocupando o espaço à direita */}
        <div className="flex flex-1 justify-end">
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-2 shadow-sm">
                <RiDashboardLine className="size-4" />
                Ir para Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
