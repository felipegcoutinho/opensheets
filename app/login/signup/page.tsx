import { signUpWithPassword } from "@/app/actions/auth/auth";
import SignupFields from "@/components/auth/signup-fields";
import { FormMessage, parseFormMessage } from "@/components/form-message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
// Header removido nesta tela para seguir o novo layout de autenticação

export default async function SignupPage(props) {
  const searchParams = await props.searchParams;
  const message = parseFormMessage(searchParams);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Criar conta</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Preencha seus dados para criar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signUpWithPassword as any} className="flex flex-col gap-4">
            <SignupFields pendingText="Criando conta..." formAction={signUpWithPassword} />
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
