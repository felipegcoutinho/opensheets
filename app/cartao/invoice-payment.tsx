import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
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

                  <Button variant="link" type="submit" className="h-0 p-0 text-green-500">
                    <CircleCheck className="mr-1" size={14} />
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

            <Button variant="link" type="submit" className="h-0 p-0 hover:underline text-orange-500 text-sm font-normal">
              Pagar
            </Button>
          </form>
        </>
      )}
    </>
  );
}
