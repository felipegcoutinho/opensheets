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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: session },
  } = await supabase.auth.getUser();

  return (
    <header className="mx-auto flex h-20 w-full items-center">
      <nav className="hidden flex-col gap-4 md:flex md:flex-row md:items-center md:gap-3 md:text-sm lg:gap-3">
        <Link href="/">
          <Logo />
        </Link>
        <Suspense>
          <LinkOnHeader user={session} />
        </Suspense>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          {session && (
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
              className="flex items-center gap-2 text-lg font-bold"
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
              href="/dashboard/transacao"
              className="transition-colors hover:text-muted-foreground"
            >
              Transações
            </Link>
            <Link
              href="/dashboard/boleto"
              className="transition-colors hover:text-muted-foreground"
            >
              Boletos
            </Link>
            <Link
              href="/dashboard/cartao"
              className="transition-colors hover:text-muted-foreground"
            >
              Cartões
            </Link>
            <Link
              href="/dashboard/conta"
              className="transition-colors hover:text-muted-foreground"
            >
              Contas
            </Link>
            <Link
              href="/dashboard/responsavel"
              className="transition-colors hover:text-muted-foreground"
            >
              Responsável
            </Link>
            <Link
              href="/dashboard/anotacao"
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

      <div className="flex w-full items-center md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <ModeToggle />
          </div>
          {session && (
            <div className="relative">
              <PrivacyButton />
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" size="icon">
              <Avatar>
                <AvatarImage
                  src="https://www.yagopartal.com/wp-content/uploads/2022/10/Black-panther-CESAR.jpg"
                  alt="Avatar"
                />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <AuthButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
