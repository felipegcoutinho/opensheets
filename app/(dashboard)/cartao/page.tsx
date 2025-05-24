import { getCards, getCardsDisabled } from "@/app/services/cartoes";
import { getAccount } from "@/app/services/contas";
import { getLimitesCartao } from "@/app/services/transacoes";
import EmptyCard from "@/components/empty-card";
import Ping from "@/components/ping-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateCard from "./modal/create-cards";
import UiCard from "./ui-card";

export default async function page(props) {
  const [cartoesAtivosData, cartoesInativos, getAccountMap] = await Promise.all(
    [getCards(), getCardsDisabled(), getAccount()],
  );

  let cardsWithLimits = [];
  if (cartoesAtivosData && cartoesAtivosData.length > 0) {
    const cardsWithLimitsPromises = cartoesAtivosData.map(async (card) => {
      const limites = await getLimitesCartao(card.id, card.limite);
      return { ...card, limites };
    });
    cardsWithLimits = await Promise.all(cardsWithLimitsPromises);
  }

  return (
    <div className="mb-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <Tabs defaultValue="ativos">
        <TabsList className="mb-2">
          <TabsTrigger value="ativos">
            <Ping color="bg-green-500" /> Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos">
            <Ping color="bg-zinc-400" /> Inativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {cardsWithLimits?.length > 0 ? (
              cardsWithLimits.map((item) => (
                <UiCard
                  key={item.id}
                  item={item}
                  getAccountMap={getAccountMap}
                  mostrarLimites={true}
                />
              ))
            ) : (
              <EmptyCard />
            )}
          </div>
        </TabsContent>

        <TabsContent value="inativos">
          <div className="grid gap-4 saturate-0 sm:grid-cols-1 lg:grid-cols-3">
            {cartoesInativos?.length > 0 ? ( // Verificação ajustada para > 0 para clareza
              cartoesInativos.map((item) => (
                <UiCard
                  key={item.id}
                  item={item}
                  getAccountMap={getAccountMap}
                  mostrarLimites={false}
                />
              ))
            ) : (
              <EmptyCard />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
