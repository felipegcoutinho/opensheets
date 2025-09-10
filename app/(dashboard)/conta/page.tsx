import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonth } from "@/hooks/get-month";
import CreateAccount from "./modal/create-accounts";
import { Suspense } from "react";
import AccountCardGridFallback from "@/components/fallbacks/account-card-grid-fallback";
import ActiveAccountsSection from "./sections/active-accounts";
import InactiveAccountsSection from "./sections/inactive-accounts";

async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

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
          <Suspense fallback={<AccountCardGridFallback count={6} />}>
            <ActiveAccountsSection month={month} />
          </Suspense>
        </TabsContent>

        <TabsContent value="inativas">
          <Suspense fallback={<AccountCardGridFallback count={6} />}>
            <InactiveAccountsSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
