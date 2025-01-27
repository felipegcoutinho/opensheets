import { forgotPasswordAction } from "@/app/actions/auth";
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
import Link from "next/link";

export default async function ForgotPassword(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Redefinir senha</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Insira seu email para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="Digite seu email" required />
              </div>
              <SubmitButton
                pendingText="Aguarde um momento..."
                formAction={forgotPasswordAction}
              >
                Redefinir
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>

            <div className="text-center text-sm">
              <p className="text-secondary-foreground">
                Já possui uma conta?{" "}
                <Link className="text-primary underline" href="/login">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
