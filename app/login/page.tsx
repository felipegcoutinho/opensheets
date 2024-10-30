import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/submit-button";

export default async function Login(props) {
  const searchParams = await props.searchParams;
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
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
        <Label>Email</Label>
        <Input
          className="mb-3"
          name="email"
          placeholder="you@example.com"
          required
        />

        <Label>Password</Label>
        <Input
          className="mb-3"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />

        <SubmitButton formAction={signIn} pendingText="Signing In...">
          Sign In
        </SubmitButton>

        {searchParams?.message && (
          <p className="mt-4 bg-red-50 p-4 text-center text-foreground">
            Não foi possível autenticar o usuário. Por favor, tente novamente ou
            verifique suas credenciais.
          </p>
        )}

        <Button variant={"link"} asChild className="w-full">
          <Link href="/login/signup">Não possui conta? Faça o cadastro</Link>
        </Button>
      </form>
    </div>
  );
}
