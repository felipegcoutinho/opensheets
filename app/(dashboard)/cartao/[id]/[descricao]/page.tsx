import CardInfo from "./card-info";
import TableInfo from "./table";
import { getCardDetails, getCards } from "@/app/services/cartoes";
import { getFaturas } from "@/app/services/faturas";
import { getCardInvoice, getCardSum } from "@/app/services/transacoes";
import CardStatusIndicator from "./card-status-Indicator";
import { getMonth } from "@/hooks/get-month";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const [cardDetails, cardInvoice, cardSum, cards, faturaStatus] =
    await Promise.all([
      getCardDetails(id),
      getCardInvoice(month, id),
      getCardSum(month, id),
      getCards(month),
      getFaturas(month, id),
    ]);

  return (
    <section>
      <CardStatusIndicator fatura_status={faturaStatus} />

      {cardDetails?.map((item) => (
        <CardInfo
          key={item.id}
          item={item}
          cardSum={cardSum}
          fatura_status={faturaStatus}
          month={month}
        />
      ))}

      <TableInfo transactions={cardInvoice} />
    </section>
  );
}
