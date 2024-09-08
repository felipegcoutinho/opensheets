import { getFaturas } from "../app/actions/invoices";
import ButtonPayment from "./button-payment";

export default async function DialogPayment({ month, paramsId, descricao, valor }) {
  const fatura_status = await getFaturas(month, paramsId);

  return <ButtonPayment fatura_status={fatura_status} month={month} paramsId={paramsId} descricao={descricao} valor={valor} />;
}
