import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../../components/SubmitButton";

export default function Login({ searchParams }) {
  const signUp = async (formData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email");
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const password = formData.get("password");
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login/signup?message=Could not authenticate user");
    }

    return redirect("/login/signup?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="nome">
          Seu nome
        </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="first_name" required />
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="last_name" required />

        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" name="email" placeholder="you@example.com" required />

        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input className="rounded-md px-4 py-2 bg-inherit border mb-6" type="password" name="password" placeholder="••••••••" required />

        <SubmitButton formAction={signUp} pendingText="Signing Up...">
          Sign Up
        </SubmitButton>
        {searchParams?.message && <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{searchParams.message}</p>}

        <Button variant={"link"} asChild className="w-full">
          <Link href="/login">Voltar para Login</Link>
        </Button>
      </form>
    </div>
  );
}
