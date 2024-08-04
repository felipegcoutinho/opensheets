import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/server";
import { Menu, Package2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthButton from "./auth-button";
import { ModeToggle } from "./darkmode-button";
import LinkOnHeader from "./link-on-header";

export default async function Header() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <Card className="flex h-16 items-center gap-4 text-black p-10 md:px-6 w-full my-2">
      <nav className="hidden flex-col gap-4 font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-5 ">
        <p className="font-bold text-lg dark:text-white">Opensheets</p>
        <LinkOnHeader user={user} />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          {user && (
            <Button size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5 text-white" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side="left" className="bg-white">
          <nav className="grid gap-6 text-lg font-medium ">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Sheets</span>
            </Link>
            <Link href="/" className="text-black transition-colors hover:text-muted-foreground">
              Home
            </Link>
            <Link href={`/transacao`} className="text-black transition-colors hover:text-muted-foreground">
              Transações
            </Link>
            <Link href={`/boleto`} className="text-black transition-colors hover:text-muted-foreground">
              boleto
            </Link>
            <Link href="/cartao" className="text-black transition-colors hover:text-muted-foreground">
              Cartões
            </Link>
            <Link href="/conta" className="text-black transition-colors hover:text-muted-foreground">
              Contas
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="sm:hidden">
        <p>Opensheets</p>
      </div>

      <div className="flex w-full items-center gap-2 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto">
          <div className="relative">
            <ModeToggle />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ajustes</DropdownMenuItem>
            <AuthButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
