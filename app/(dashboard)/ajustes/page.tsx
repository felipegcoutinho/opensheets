import {
  getFirstName,
  getLastName,
  getEmail,
} from "@/app/actions/users/fetch_users";
import UpdateNameForm from "./update-name-form";
import ResetPasswordForm from "./reset-password-form";
import DeleteUserForm from "./delete-user-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const metadata = { title: "Ajustes | OpenSheets" };

export default async function AjustesPage() {
  const [firstName, lastName, email] = await Promise.all([
    getFirstName(),
    getLastName(),
    getEmail(),
  ]);

  return (
    <Tabs defaultValue="name" className="mt-4">
      <TabsList>
        <TabsTrigger value="name">Altere seu nome</TabsTrigger>
        <TabsTrigger value="password">Altere sua senha</TabsTrigger>
        <TabsTrigger value="delete">Excluir conta</TabsTrigger>
      </TabsList>
      <TabsContent value="name">
        <UpdateNameForm
          defaultFirstName={firstName ?? ""}
          defaultLastName={lastName ?? ""}
        />
      </TabsContent>
      <TabsContent value="password">
        <ResetPasswordForm email={email ?? ""} />
      </TabsContent>
      <TabsContent value="delete">
        <DeleteUserForm />
      </TabsContent>
    </Tabs>
  );
}
