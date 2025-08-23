import { FormMessage } from "@/components/form-message";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { RiGoogleFill } from "@remixicon/react";
import Link from "next/link";
import { signIn, signInWithGoogle } from "../actions/auth/auth";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Entre com seu email e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="Digite seu email" required />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    className="text-primary text-sm hover:underline"
                    href="/login/forgot-password"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <PasswordInput
                  name="password"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            <SubmitButton
              formAction={signIn}
              pendingText="Fazendo Login..."
              className="mt-2"
            >
              Login
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>

          <Button variant="link" className="w-full" asChild>
            <Link href="/login/signup">Não possui conta? Faça o cadastro</Link>
          </Button>

          <form action={signInWithGoogle} className="mt-4">
            <Button variant="outline" className="flex w-full items-center">
              <RiGoogleFill
                className="text-orange-600"
                size={16}
                aria-hidden="true"
              />
              Entrar com Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
