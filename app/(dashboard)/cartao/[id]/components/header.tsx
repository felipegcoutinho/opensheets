import CardInfo from "../card-info";
import CardStatusIndicator from "../card-status-Indicator";
import { getCardDetails } from "@/app/actions/cards/fetch_cards";
import { getFaturas } from "@/app/actions/invoices/fetch_invoices";
import { getCardSum } from "@/app/actions/transactions/fetch_transactions";

export default async function CardHeaderSection({ id, month }: { id: string; month: string }) {
  const [cardDetails, cardSum, faturaStatus] = await Promise.all([
    getCardDetails(id),
    getCardSum(month, id),
    getFaturas(month, id),
  ]);

  return (
    <>
      <CardStatusIndicator fatura_status={faturaStatus} vencimento={cardDetails?.dt_vencimento} />
      {cardDetails && (
        <CardInfo
          key={cardDetails.id}
          item={cardDetails}
          cardSum={cardSum}
          fatura_status={faturaStatus}
          month={month}
        />
      )}
    </>
  );
}
