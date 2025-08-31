import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getLimitesCartao } from "@/app/actions/transactions/fetch_transactions";
import EmptyCard from "@/components/empty-card";
import UiCard from "../ui-card";

export default async function ActiveCardsSection() {
  const [cards, getAccountMap] = await Promise.all([getCards(), getAccount()]);

  if (!cards?.length) return <EmptyCard />;

  const cardsWithLimits = await Promise.all(
    cards.map(async (card) => ({
      ...card,
      limites: await getLimitesCartao(card.id, card.limite),
    })),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cardsWithLimits.map((item) => (
        <UiCard
          key={item.id}
          item={item}
          getAccountMap={getAccountMap}
          mostrarLimites={true}
        />
      ))}
    </div>
  );
}
