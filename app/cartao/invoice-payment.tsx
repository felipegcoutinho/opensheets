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
                <div className="text-green-400 p-4 rounded-lg" key={item.id}>
                  <p>{item.status_pagamento}</p>
                </div>

                <form action={deleteFaturas}>
                  <input type="hidden" name="excluir" value={item.id} />

                  <select hidden name="status_pagamento" defaultValue={"Pendente"} placeholder="pagar">
                    <option value="Pendente">Pendente</option>
                  </select>

                  <input type="hidden" name="periodo" defaultValue={month} />
                  <input type="hidden" name="cartao_id" defaultValue={paramsId} />

                  <Button type="submit" className="mt-6">
                    Atualizar para Pendente
                  </Button>
                </form>
              </>
            )
        )
      ) : (
        <>
          <div className="text-orange-600  p-4 rounded-lg">
            <p>Pendente</p>
          </div>

          <form action={addFaturas}>
            <select hidden name="status_pagamento" defaultValue={"Pago"} placeholder="pagar">
              <option value="Pago">Pagar</option>
            </select>

            <input type="hidden" name="periodo" defaultValue={month} />
            <input type="hidden" name="cartao_id" defaultValue={paramsId} />

            <Button type="submit" className="mt-6">
              Pagar
            </Button>
          </form>
        </>
      )}
    </>
  );
}
