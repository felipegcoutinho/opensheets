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
import { signIn } from "../actions/auth";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="normal-case text-muted-foreground">
            Entre com seu email e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="Digite seu email" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <SubmitButton formAction={signIn} pendingText="Fazendo Login...">
                Login
              </SubmitButton>

              {searchParams?.message && (
                <p className="mt-4 bg-red-50 p-4 text-center text-foreground">
                  Não foi possível autenticar o usuário. Por favor, tente
                  novamente ou verifique suas credenciais.
                </p>
              )}
            </div>
            <div className="mt-2 text-center text-sm">
              <Button variant={"link"} asChild className="w-full">
                <Link href="/login/signup">
                  Não possui conta? Faça o cadastro
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
