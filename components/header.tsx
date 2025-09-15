import { getUserSession } from "@/app/actions/users/fetch_users";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import AuthButton from "./auth-button";
import Logo from "./logo";

import { RiLayout5Line } from "@remixicon/react";
import HeaderBlur from "./header-blur";

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

        {/* Menu e ações à direita */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#sobre"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/#recursos"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Recursos
            </Link>
            <Link
              href="/#preco"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Preço
            </Link>
            <Link
              href="/#faq"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/#contato"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Contato
            </Link>
          </nav> */}
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-2 shadow-sm">
                <RiLayout5Line className="size-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/login/signup">
                <Button size="sm" className="shadow-sm">
                  Criar conta
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
