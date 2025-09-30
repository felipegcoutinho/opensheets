import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCardsDisabled } from "@/app/actions/cards/fetch_cards";
import EmptyCard from "@/components/empty-card";
import UiCard from "../ui-card";

export default async function InactiveCardsSection() {
  const [cards, getAccountMap] = await Promise.all([
    getCardsDisabled(),
    getAccount(),
  ]);

  if (!cards?.length) return <EmptyCard />;

  return (
    <div className="grid grid-cols-1 gap-4 saturate-0 sm:grid-cols-1 lg:grid-cols-3">
      {cards.map((item) => (
        <UiCard
          key={item.id}
          item={item}
          getAccountMap={getAccountMap}
          mostrarLimites={false}
          showDelete
        />
      ))}
    </div>
  );
}
