import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmitButton } from "../../components/submit-button";

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
        <Label>Email</Label>
        <Input className="mb-3" name="email" placeholder="you@example.com" required />

        <Label>Password</Label>
        <Input className="mb-3" type="password" name="password" placeholder="••••••••" required />

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
