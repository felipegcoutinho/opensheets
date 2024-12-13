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
    <div className="flex w-full flex-1 flex-col justify-center gap-2 p-8 sm:max-w-md">
      <div className="mx-auto mb-10 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Criar Conta</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu email e senha para criar sua conta.
          </p>
        </div>
      </div>
      <form className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
        <Label>Seu nome</Label>
        <div className="mb-3 flex gap-2">
          <Input placeholder="Primeiro nome" name="first_name" required />
          <Input placeholder="Sobrenome" name="last_name" required />
        </div>

        <Label>Email</Label>
        <Input
          name="email"
          placeholder="Digite seu email"
          className="mb-3"
          required
        />

        <Label>Senha</Label>
        <Input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          className="mb-5"
          required
        />

        <SubmitButton formAction={signUp} pendingText="Criando Conta...">
          Criar Conta
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
