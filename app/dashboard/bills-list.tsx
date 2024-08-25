import { ShieldQuestion } from "lucide-react";
import { getBillsByResponsavel } from "../actions/dashboards";

export async function BIllsList({ month }) {
  const invoices = await getBillsByResponsavel(month);

  return (
    <>
      {invoices.length > 0 ? (
        invoices.map((item) => (
          <div className="grid gap-2 pb-2">
            <div className="grid">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">{item.descricao}</p>
                <p className="font-bold">{Number(item.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
              </div>

              <p className={`text-muted-foreground text-sm ${item.status_pagamento === "Pago" ? "text-green-500" : "text-orange-500"}`}>
                {item.status_pagamento}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <ShieldQuestion className="h-8 w-8 text-muted-foreground" />
          <span className="text-muted-foreground">Não há dados disponíveis.</span>
        </div>
      )}
    </>
  );
}
