import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/SubmitButton";

export default function Login() {
  const signIn = async (formData) => {
    "use server";

    const email = formData.get("email");
    const password = formData.get("password");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/dashboard");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="email" placeholder="you@example.com" required />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" type="password" name="password" placeholder="••••••••" required />
        <SubmitButton formAction={signIn} pendingText="Signing In...">
          Sign In
        </SubmitButton>

        <Button variant={"link"} asChild className="w-full">
          <Link href="/login/signup">Não possui conta? Faça o cadastro</Link>
        </Button>
      </form>
    </div>
  );
}
