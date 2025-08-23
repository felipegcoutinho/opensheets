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
import { sendMagicLink, signInWithGoogle } from "../actions/auth/auth";
import { RiGoogleFill, RiMailSendLine } from "@remixicon/react";

export default async function Login(props) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex flex-col gap-6">
      <Card>
          <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Acesso por Magic Link</CardTitle>
          <CardDescription className="text-muted-foreground normal-case">
            Informe seu email e enviaremos um link seguro de acesso.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" placeholder="Digite seu email" required />
              </div>
            </div>

            <SubmitButton
              formAction={sendMagicLink as any}
              pendingText="Enviando link..."
              className="mt-2"
            >
              Enviar magic link
            </SubmitButton>

            <FormMessage message={searchParams} />

            {searchParams?.success && (
              <div className="bg-muted/40 text-muted-foreground mt-2 rounded-md border p-4">
                <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                  <RiMailSendLine aria-hidden /> Verifique sua caixa de entrada
                </div>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Abra o e-mail que acabamos de enviar para você.</li>
                  <li>
                    Se não encontrar na caixa de entrada, verifique as pastas
                    de <span className="font-medium">spam</span>,
                    <span className="font-medium"> lixo eletrônico</span> ou
                    <span className="font-medium"> promoções</span>.
                  </li>
                  <li>
                    Clique no link do e-mail para acessar com segurança. O link
                    expira após algum tempo.
                  </li>
                  <li>
                    Digitou o e-mail errado? Basta reenviar o magic link com o
                    endereço correto.
                  </li>
                </ul>
              </div>
            )}
          </form>

          <form action={signInWithGoogle} className="mt-4">
            <Button variant="outline" className="flex w-full items-center gap-2">
              <RiGoogleFill className="text-orange-600" size={16} aria-hidden />
              Entrar com Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
