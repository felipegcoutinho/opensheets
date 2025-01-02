import { getEmail, getUserName } from "@/app/actions/users";
import { signOut } from "@actions/auth";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const user = await getUserName();
  const email = await getEmail();

  return (
    <div className="flex items-center">
      {user ? (
        <div className="flex flex-col items-start">
          <Button variant="link">{user}</Button>
          <Button variant="link">{email}</Button>
          <form action={signOut}>
            <Button className="font-bold text-red-500" variant="link">
              Sair
            </Button>
          </form>
        </div>
      ) : (
        <Link href="/login">
          <Button className="px-2" variant="link">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}
