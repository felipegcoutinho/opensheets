import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCardDetails, getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getFaturas } from "@/app/actions/invoices/fetch_invoices";
import {
  getCardInvoice,
  getCardSum,
} from "@/app/actions/transactions/fetch_transactions";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CardInfo from "./card-info";
import CardStatusIndicator from "./card-status-Indicator";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const contas = await getAccount();
  const categorias = await getCategorias();

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
      <MonthPicker />
      <CardStatusIndicator fatura_status={faturaStatus} />

      {cardDetails && (
        <CardInfo
          key={cardDetails.id}
          item={cardDetails}
          cardSum={cardSum}
          fatura_status={faturaStatus}
          month={month}
        />
      )}

      <TableTransaction
        data={cardInvoice}
        getAccount={contas}
        getCards={cards}
        getCategorias={categorias}
        hidden={false}
      />
    </section>
  );
}
