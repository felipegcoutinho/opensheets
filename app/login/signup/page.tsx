import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../../components/submit-button";

export default async function Login(props) {
  const searchParams = await props.searchParams;
  const signUp = async (formData) => {
    "use server";

    const origin = (await headers()).get("origin");
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

    return redirect(
      "/login/signup?message=Check email to continue sign in process",
    );
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
        <Label>Seu nome</Label>
        <div className="mb-3 flex gap-2">
          <Input placeholder="Primeiro nome" name="first_name" required />
          <Input placeholder="Sobrenome" name="last_name" required />
        </div>

        <Label>Email</Label>
        <Input
          name="email"
          placeholder="email@opensheets.com"
          className="mb-3"
          required
        />

        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••••••••••"
          className="mb-5"
          required
        />

        <SubmitButton formAction={signUp} pendingText="Signing Up...">
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}

        <Button variant={"link"} asChild className="w-full">
          <Link href="/login">Voltar para Login</Link>
        </Button>
      </form>
    </div>
  );
}
