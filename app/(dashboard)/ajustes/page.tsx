import { getUserName } from "@/app/actions/users/fetch_users";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiErrorWarningLine } from "@remixicon/react";
import DeleteUserForm from "./delete-user-form";
import FeedbackForm from "./feedback-form";
import UpdateNameForm from "./update-name-form";
import UpdatePasswordForm from "./update-password-form";
import UpdateEmailForm from "./update-email-form";
import { getEmail } from "@/app/actions/users/fetch_users";

export default async function AjustesPage() {
  const [name, email] = await Promise.all([getUserName(), getEmail()]);

  return (
    <Tabs defaultValue="name" className="mt-4">
      <TabsList>
        <TabsTrigger value="name">Altere seu nome</TabsTrigger>
        <TabsTrigger value="password">Alterar senha</TabsTrigger>
        <TabsTrigger value="email">Alterar e-mail</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="delete">Deletar conta</TabsTrigger>
      </TabsList>
      <TabsContent value="name">
        <UpdateNameForm defaultName={name ?? ""} />
      </TabsContent>
      <TabsContent value="password">
        <div className="max-w-xl space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alterar senha</h3>
            <p className="text-muted-foreground text-sm">
              Defina uma nova senha para sua conta. Guarde-a em local seguro.
            </p>
          </div>
          <UpdatePasswordForm defaultEmail={email ?? ""} />
        </div>
      </TabsContent>

      <TabsContent value="email">
        <div className="max-w-xl space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alterar e-mail</h3>
            <p className="text-muted-foreground text-sm">
              Atualize o e-mail associado à sua conta. Podemos enviar um link de confirmação para validar a alteração.
            </p>
          </div>
          <UpdateEmailForm defaultEmail={email ?? ""} />
        </div>
      </TabsContent>
      <TabsContent value="feedback">
        <div className="max-w-xl space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Envie seu feedback</h3>
            <p className="text-muted-foreground text-sm">
              Conte como podemos melhorar o OpenSheets. Seja específico:
              descreva o que aconteceu, quais passos você realizou, o que
              esperava que acontecesse e o que aconteceu de fato. Se for
              sugestão, explique o problema que deseja resolver e como imagina a
              solução.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </TabsContent>
      <TabsContent value="delete">
        <div className="max-w-xl space-y-4">
          <Alert variant="destructive">
            <RiErrorWarningLine aria-hidden />
            <AlertTitle>Remoção definitiva de conta</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  Ao prosseguir, sua conta e todos os dados associados serão
                  excluídos de forma <strong>irreversível</strong>.
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Lançamentos, anexos e notas</li>
                  <li>Contas, cartões, orçamentos e categorias</li>
                  <li>Pagadores (incluindo o pagador principal)</li>
                  <li>Preferências e configurações</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <DeleteUserForm />
        </div>
      </TabsContent>
    </Tabs>
  );
}
