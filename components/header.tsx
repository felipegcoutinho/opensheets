import { getSession } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import AuthButton from "./auth-button";
import Logo from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4">
        {/* Logo sempre visível */}
        <div className="shrink-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Área de login/usuário ocupando o espaço à direita */}
        <div className="flex flex-1 justify-end">
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
