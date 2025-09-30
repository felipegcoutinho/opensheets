import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateCardSection from "./components/create-card";
import ActiveCardsSection from "./components/active-cards";
import InactiveCardsSection from "./components/inactive-cards";

export default async function page() {
  return (
    <div className="mb-4 w-full">
      <CreateCardSection />

      <Tabs defaultValue="ativos">
        <TabsList className="mb-2">
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <Ping color="bg-emerald-500" /> Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos" className="flex items-center gap-2">
            <Ping color="bg-zinc-400" /> Inativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <ActiveCardsSection />
        </TabsContent>

        <TabsContent value="inativos">
          <InactiveCardsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
