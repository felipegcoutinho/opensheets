import { getFirstName, getLastName } from "@/app/actions/users/fetch_users";
import UpdateNameForm from "./update-name-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DeleteUserForm from "./delete-user-form";

export const metadata = { title: "Ajustes | OpenSheets" };

export default async function AjustesPage() {
  const [firstName, lastName] = await Promise.all([
    getFirstName(),
    getLastName(),
  ]);

  return (
    <Tabs defaultValue="name" className="mt-4">
      <TabsList>
        <TabsTrigger value="name">Altere seu nome</TabsTrigger>
        <TabsTrigger value="delete">Deletar conta</TabsTrigger>
      </TabsList>
      <TabsContent value="name">
        <UpdateNameForm
          defaultFirstName={firstName ?? ""}
          defaultLastName={lastName ?? ""}
        />
      </TabsContent>
      <TabsContent value="delete">
        <DeleteUserForm />
      </TabsContent>
    </Tabs>
  );
}
