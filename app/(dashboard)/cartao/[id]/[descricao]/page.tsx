import CardInfo from "./card-info";
import { getCardDetails, getCards } from "@/app/services/cartoes";
import { getFaturas } from "@/app/services/faturas";
import { getCardInvoice, getCardSum } from "@/app/services/transacoes";
import CardStatusIndicator from "./card-status-Indicator";
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "@/app/(dashboard)/lancamentos/table/table-transaction";
import { getAccount } from "@/app/services/contas";
import { getNewCategorias } from "@/app/services/categorias";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const contas = await getAccount();
  const categorias = await getNewCategorias();

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

      <TableTransaction
        data={cardInvoice}
        getAccount={contas}
        getCards={cards}
        getCategorias={categorias}
        hidden={true}
      />
    </section>
  );
}
