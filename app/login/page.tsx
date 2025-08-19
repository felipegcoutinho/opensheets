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
import { Label } from "@/components/ui/label";
import { RiGoogleFill } from "@remixicon/react";
import { signIn, signInWithGoogle } from "../actions/auth/auth";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Entre com seu email e senha para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="Digite seu email" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link className="text-sm" href="/login/forgot-password">
                    Esqueceu a senha?
                  </Link> */}
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

              <FormMessage message={searchParams} />
            </div>

            {/* <div>
              <Button variant={"link"} className="w-full" asChild>
                <Link href="/login/signup">
                  Não possui conta? Faça o cadastro
                </Link>
              </Button>
            </div> */}
          </form>

          <form action={signInWithGoogle}>
            <Button variant="outline" className="w-full">
              <RiGoogleFill /> Entrar com Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
