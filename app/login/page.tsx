import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@actions/auth";
import Link from "next/link";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 p-8 sm:max-w-md">
      <div className="mx-auto mb-10 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Faça seu login
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu email e senha para acessar sua conta.
          </p>
        </div>
      </div>
      <form className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
        <Label>Email</Label>
        <Input
          className="mb-3"
          name="email"
          placeholder="Digite seu email"
          required
        />

        <Label>Senha</Label>
        <Input
          className="mb-3"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          required
        />

        <SubmitButton formAction={signIn} pendingText="Fazendo Login...">
          Login
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
