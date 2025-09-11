import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonth } from "@/hooks/get-month";
import CreateAccount from "./modal/create-accounts";
import ActiveAccountsSection from "./sections/active-accounts";
import InactiveAccountsSection from "./sections/inactive-accounts";

async function page({ searchParams }: { searchParams?: { periodo?: string } }) {
  const month = await getMonth({ searchParams });

  return (
    <div className="w-full">
      <CreateAccount />

      <Tabs defaultValue="ativas">
        <TabsList className="mb-2">
          <TabsTrigger value="ativas" className="flex items-center gap-2">
            <Ping color="bg-emerald-500" /> Ativas
          </TabsTrigger>
          <TabsTrigger value="inativas" className="flex items-center gap-2">
            <Ping color="bg-zinc-400" /> Inativas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativas">
          <ActiveAccountsSection month={month} />
        </TabsContent>

        <TabsContent value="inativas">
          <InactiveAccountsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
