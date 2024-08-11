import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../../components/submit-button";

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
        <Label>Seu nome</Label>
        <div className="flex gap-2 mb-3">
          <Input name="first_name" required />
          <Input name="last_name" required />
        </div>

        <Label>Email</Label>
        <Input name="email" placeholder="bill@gates.com" className="mb-3" required />

        <Label>Password</Label>
        <Input type="password" name="password" placeholder="••••••••" className="mb-5" required />

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
