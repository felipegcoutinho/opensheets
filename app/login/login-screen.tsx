import { signInWithPassword } from "@/app/actions/auth/auth";
import { FormMessage, parseFormMessage } from "@/components/form-message";
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
import Link from "next/link";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LoginScreen({ searchParams }: Props) {
  const message = parseFormMessage(searchParams);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Acesse sua conta</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Entre usando seu e-mail e senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={signInWithPassword as any}
            className="mt-2 flex flex-col gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Sua senha"
                required
              />
            </div>
            <SubmitButton
              pendingText="Entrando..."
              className="mt-1 w-full"
              formAction={signInWithPassword}
            >
              Entrar
            </SubmitButton>
            <div className="mt-2 flex items-center justify-between text-xs">
              <Link
                href="/login/reset"
                className="text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Esqueci a senha
              </Link>
              <Link
                href="/login/signup"
                className="text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                Criar conta
              </Link>
            </div>
          </form>

          <div className="mt-4">
            <FormMessage message={message} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
