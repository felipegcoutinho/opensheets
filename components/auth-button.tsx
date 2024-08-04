import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

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
