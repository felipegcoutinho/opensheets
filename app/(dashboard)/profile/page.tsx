import { getUserName, getEmail } from "@/app/actions/users/fetch_users";
import UpdateNameForm from "./update-name-form";
import ResetPasswordForm from "./reset-password-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const metadata = { title: "Perfil | OpenSheets" };

export default async function ProfilePage() {
  const [name, email] = await Promise.all([getUserName(), getEmail()]);

  return (
    <Tabs defaultValue="name" className="mt-4">
      <TabsList>
        <TabsTrigger value="name">Nome</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="name">
        <UpdateNameForm defaultName={name ?? ""} />
      </TabsContent>
      <TabsContent value="password">
        <ResetPasswordForm email={email ?? ""} />
      </TabsContent>
    </Tabs>
  );
}
