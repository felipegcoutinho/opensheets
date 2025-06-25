import { signup } from "@/app/actions/auth/auth";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function SignUp(props) {
  const searchParams = await props.searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Criar conta</CardTitle>
        <CardDescription className="text-muted-foreground normal-case">
          Entre com seu nome, email e senha para criar sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2">
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

          <SubmitButton formAction={signup} pendingText="Criando Conta...">
            Criar Conta
          </SubmitButton>

          {searchParams?.message && (
            <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
              {searchParams.message}
            </p>
          )}

          <Button variant={"link"} asChild className="w-full">
            <Link href="/login">Voltar para Login</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
