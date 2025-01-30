import { getSession } from "@/app/actions/users";
import PrivacyButton from "@/components/privacy-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import AuthButton from "./auth-button";
import { ModeToggle } from "./darkmode-button";
import LinkOnHeader from "./links-on-header";
import LinksOnMobile from "./links-on-mobile";
import Logo from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetTrigger } from "./ui/sheet";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="bg-background text-color-2 mb-4 w-full border-b">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-2">
        {/* Menu para telas pequenas */}
        <div className="flex items-center gap-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              {session && (
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              )}
            </SheetTrigger>

            <LinksOnMobile session={session} />
          </Sheet>
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>
        </div>

        {/* Logo e menu para telas médias e grandes */}
        <div className="hidden md:flex md:w-full md:items-center">
          {/* Logo à esquerda */}
          <div className="mr-6 shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* Links centralizados */}
          <div className="flex flex-1 justify-start">
            <LinkOnHeader session={session} />
          </div>
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {session && (
              <>
                <ModeToggle />
                <PrivacyButton />
              </>
            )}
          </div>

          <DropdownMenu>
            {session ? (
              <DropdownMenuTrigger asChild>
                <Button variant="link" size="icon">
                  <Avatar>
                    <AvatarImage src="/black_panter.jpg" alt="Avatar" />
                    <AvatarFallback>OP</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}

            <DropdownMenuContent align="end">
              <AuthButton session={session} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
