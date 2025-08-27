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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithPassword, signUpWithPassword } from "../actions/auth/auth";
import SignupFields from "@/components/auth/signup-fields";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Acesse sua conta</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
          Entre ou crie sua conta usando e-mail e senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList>
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-2">
              <form action={signInWithPassword as any} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <PasswordInput id="password" name="password" placeholder="Sua senha" required />
                </div>
                <SubmitButton pendingText="Entrando..." className="mt-2" formAction={signInWithPassword}>
                  Entrar
                </SubmitButton>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-2">
              <form action={signUpWithPassword as any} className="flex flex-col gap-4">
                <SignupFields pendingText="Criando conta..." formAction={signUpWithPassword} />
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <FormMessage message={searchParams} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
