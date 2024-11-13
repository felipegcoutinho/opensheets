import { createClient } from "@/utils/supabase/server";
import { signOut } from "@actions/auth";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center">
      <form action={signOut}>
        <Button className="px-2 text-red-500" variant="link">
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
  );
}
