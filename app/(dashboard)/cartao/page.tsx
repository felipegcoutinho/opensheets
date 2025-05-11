import { getCards, getCardsDisabled } from "@/app/services/cartoes";
import { getAccount } from "@/app/services/contas";
import { getLimitesCartao } from "@/app/services/transacoes";
import EmptyCard from "@/components/empty-card";
import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonth } from "@/hooks/get-month";
import CreateCard from "./modal/create-cards";
import UiCard from "./ui-card";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const cartoesAtivos = await getCards();
  const cartoesInativos = await getCardsDisabled();
  const getAccountMap = await getAccount();

  const cardsWithLimits = await Promise.all(
    cartoesAtivos?.map(async (card) => {
      const limites = await getLimitesCartao(card.id, card.limite);
      return { ...card, limites };
    }),
  );

  return (
    <div className="w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <Tabs defaultValue="ativos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ativos">
            <Ping color="bg-green-500" /> Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos">
            <Ping color="bg-zinc-400" /> Inativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {cardsWithLimits?.length !== 0 ? (
              cardsWithLimits.map((item) => (
                <UiCard
                  key={item.id}
                  item={item}
                  getAccountMap={getAccountMap}
                  mostrarLimites={true}
                />
              ))
            ) : (
              <EmptyCard height={100} width={100} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="inativos">
          <div className="grid gap-4 saturate-0 sm:grid-cols-1 lg:grid-cols-3">
            {cartoesInativos?.length !== 0 ? (
              cartoesInativos.map((item) => (
                <UiCard
                  key={item.id}
                  item={item}
                  getAccountMap={getAccountMap}
                  mostrarLimites={false}
                />
              ))
            ) : (
              <EmptyCard height={100} width={100} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
