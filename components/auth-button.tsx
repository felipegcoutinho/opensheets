import { signOut } from "@/app/actions/auth/auth";
import { getEmail, getUserName } from "@/app/actions/users/fetch_users";
import { RiDashboardLine, RiLogoutBoxLine } from "@remixicon/react"; // Adicionando ícone de configurações
import Link from "next/link";
import { Button } from "./ui/button";

type AuthButtonProps = {
  session: boolean;
};

export default async function AuthButton({ session }: AuthButtonProps) {
  const [user, email] = await Promise.all([getUserName(), getEmail()]);

  return (
    <>
      {session && (
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 p-2">
            <div className="text-muted-foreground flex flex-col items-start">
              <span className="text-sm">{user}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            <Link href="/dashboard/" className="w-full">
              <Button
                variant="ghost"
                className="flex w-full items-center gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <RiDashboardLine className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>

            <form action={signOut} className="w-full">
              <Button
                variant="ghost"
                className="flex w-full items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <RiLogoutBoxLine className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
