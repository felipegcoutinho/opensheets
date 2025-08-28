import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { signInWithPassword } from "../actions/auth/auth";
import Link from "next/link";
import Header from "@/components/header";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Header />
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Acesse sua conta</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Entre usando seu e-mail e senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInWithPassword as any} className="mt-2 flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput id="password" name="password" placeholder="Sua senha" required />
            </div>
            <div className="flex items-center justify-between">
              <Link href="/login/reset" className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2">
                Esqueci a senha
              </Link>
              <Link href="/login/signup" className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2">
                Não tem conta? Criar conta
              </Link>
            </div>
            <SubmitButton pendingText="Entrando..." className="mt-1" formAction={signInWithPassword}>
              Entrar
            </SubmitButton>
          </form>

          <div className="mt-4">
            <FormMessage message={searchParams} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
