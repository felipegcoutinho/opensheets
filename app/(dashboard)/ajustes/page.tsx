import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function page() {
  return (
    <div className="mt-4 w-full">
      <Tabs defaultValue="categoria" className="w-[400px]">
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
        <TabsContent value="categoria">gerenciar categorias</TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
