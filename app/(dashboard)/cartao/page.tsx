import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import CardGridSkeleton from "@/components/skeletons/card-grid-skeleton";
import CreateCardSection from "./sections/create-card";
import ActiveCardsSection from "./sections/active-cards";
import InactiveCardsSection from "./sections/inactive-cards";

export default async function page() {
  const fallback = <CardGridSkeleton count={6} />;
  return (
    <div className="mb-4 w-full">
      <Suspense fallback={<div className="h-10 w-64 animate-pulse rounded bg-accent" /> }>
        <CreateCardSection />
      </Suspense>

      <Tabs defaultValue="ativos">
        <TabsList className="mb-2">
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <Ping color="bg-green-500" /> Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos" className="flex items-center gap-2">
            <Ping color="bg-zinc-400" /> Inativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <Suspense fallback={fallback}>
            <ActiveCardsSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="inativos">
          <Suspense fallback={fallback}>
            <InactiveCardsSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
