import { getEmail, getUserName } from "@/app/actions/users";
import { signOut } from "@actions/auth";
import { LogOut } from "lucide-react"; // Adicionando ícone de logout
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default async function AuthButton({ session }) {
  const user = await getUserName();
  const email = await getEmail();

  return (
    <>
      {session && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage
                src="https://www.yagopartal.com/wp-content/uploads/2022/10/Black-panther-CESAR.jpg"
                alt="Avatar"
              />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">{user}</span>
              <span className="truncate text-xs text-gray-500">{email}</span>
            </div>
          </div>

          <form action={signOut}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
