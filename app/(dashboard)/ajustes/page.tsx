import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManagerCategoria from "./categorias/manager-categoria";
import { getNewCategorias } from "@/app/services/categorias";
import { Card } from "@/components/ui/card";

async function page() {
  const categorias = await getNewCategorias();

  return (
    <div className="mt-4">
      <Tabs defaultValue="categoria">
        <TabsList>
          <TabsTrigger value="categoria">Categorias</TabsTrigger>
          <TabsTrigger value="alterar_senha">Alterar senha</TabsTrigger>
        </TabsList>
        <TabsContent value="alterar_senha">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Ajustes</h3>
              <p className="text-muted-foreground text-sm">
                This is how others will see you on the site.
              </p>
              {/* <ProfileForm /> */}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="categoria">
          <Card className="my-4">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Gerenciar Categorias</h3>
              <p className="text-muted-foreground">
                Você pode adicionar, editar ou remover categorias de despesas e
                receitas. <br /> As categorias são usadas para organizar suas
                transações financeiras.
              </p>
            </div>

            <ManagerCategoria categorias={categorias} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
