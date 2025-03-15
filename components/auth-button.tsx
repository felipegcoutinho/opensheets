import { signOut } from "@/actions/auth";
import { getEmail, getUserName } from "@/app/actions/users";
import { LogOut } from "lucide-react"; // Adicionando ícone de configurações
import { Button } from "./ui/button";

export default async function AuthButton({ session }) {
  const user = await getUserName();
  const email = await getEmail();

  return (
    <>
      {session && (
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 p-2">
            <div className="text-muted-foreground flex flex-col items-start">
              <span className="text-sm font-bold">{user}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-2">
            {/* <Link href="/dashboard/ajustes" className="w-full">
              <Button
                variant="ghost"
                className="flex w-full items-center gap-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Settings className="h-4 w-4" />
                <span>Ajustes</span>
              </Button>
            </Link> */}

            <form action={signOut} className="w-full">
              <Button
                variant="ghost"
                className="flex w-full items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
