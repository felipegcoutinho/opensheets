import { Button } from "@/components/ui/button";
import { addFaturas, deleteFaturas, getFaturas } from "../actions/invoices";

export default async function InvoicePayment({ month, paramsId }) {
  const fatura_status = await getFaturas(month, paramsId);

  return (
    <>
      {fatura_status && fatura_status.length > 0 ? (
        fatura_status.map(
          (item) =>
            item.status_pagamento === "Pago" && (
              <>
                <form action={deleteFaturas}>
                  <input type="hidden" name="excluir" value={item.id} />

                  <Button
                    variant="secondary"
                    type="submit"
                    className="bg-green-50 dark:bg-green-900 text-green-500 dark:text-green-300 text-sm h-6 hover:bg-green-100"
                  >
                    Pago
                  </Button>
                </form>
              </>
            )
        )
      ) : (
        <>
          <form action={addFaturas}>
            <input type="hidden" name="status_pagamento" defaultValue={"Pago"} />
            <input type="hidden" name="periodo" defaultValue={month} />
            <input type="hidden" name="cartao_id" defaultValue={paramsId} />

            <Button
              variant="secondary"
              type="submit"
              className="bg-orange-50 dark:bg-orange-900 text-orange-500 dark:text-orange-300 text-sm h-6 hover:bg-orange-100"
            >
              Pagar
            </Button>
          </form>
        </>
      )}
    </>
  );
}
