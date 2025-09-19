import { sendPasswordResetEmailFromReset } from "@/app/actions/auth/reset_password";
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
import Link from "next/link";
// Header removido nesta tela para seguir o novo layout de autenticação

export default async function ResetPasswordPage(props) {
  const searchParams = await props.searchParams;
  const message = parseFormMessage(searchParams);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Redefinir senha</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Informe seu e-mail para receber um link de redefinição.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={sendPasswordResetEmailFromReset as any} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>

            <SubmitButton pendingText="Enviando..." className="mt-2 w-full" formAction={sendPasswordResetEmailFromReset}>
              Enviar link de redefinição
            </SubmitButton>
          </form>

          <div className="mt-4">
            <FormMessage message={message} />
          </div>

          <div className="mt-2 text-center">
            <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-2">
              Voltar para login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
