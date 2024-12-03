import PrivacyButton from "@/components/privacy-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/server";
import { Menu } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import AuthButton from "./auth-button";
import { ModeToggle } from "./darkmode-button";
import LinkOnHeader from "./links-on-header";
import Logo from "./logo";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto mb-2 flex h-20 w-full items-center bg-transparent dark:border-none">
      <nav className="hidden flex-col gap-4 md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-3">
        <Link href="/" className="pr-10">
          <Logo />a
        </Link>
        <Suspense>
          <LinkOnHeader user={user} />
        </Suspense>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          {user && (
            <Button size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          )}
        </SheetTrigger>

        <SheetContent side="left">
          <nav className="grid gap-6 text-lg">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <span className="sr-only">openSheets</span>
            </Link>
            <Link
              href="/"
              className="transition-colors hover:text-muted-foreground"
            >
              Home
            </Link>
            <Link
              href={`/transacao`}
              className="transition-colors hover:text-muted-foreground"
            >
              Transações
            </Link>
            <Link
              href={`/boleto`}
              className="transition-colors hover:text-muted-foreground"
            >
              Boletos
            </Link>
            <Link
              href="/cartao"
              className="transition-colors hover:text-muted-foreground"
            >
              Cartões
            </Link>
            <Link
              href="/conta"
              className="transition-colors hover:text-muted-foreground"
            >
              Contas
            </Link>
            <Link
              href="/responsavel"
              className="transition-colors hover:text-muted-foreground"
            >
              Responsável
            </Link>
            <Link
              href="/anotacao"
              className="transition-colors hover:text-muted-foreground"
            >
              Anotações
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="pl-2 sm:hidden">
        <Logo />
      </div>

      <div className="flex w-full items-center gap-2 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <ModeToggle />
          </div>
          <div className="relative">
            <PrivacyButton />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" size="icon">
              <Menu className="h-5 w-5 bg-transparent" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* {user && (
              <Link
                href="/ajustes"
                className="text-black transition-colors hover:text-muted-foreground"
              >
                <Button className="px-2" variant="link">
                  Ajustes
                </Button>
              </Link>
            )} */}
            <AuthButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
