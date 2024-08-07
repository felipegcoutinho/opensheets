import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBills } from "../actions/bills";

export async function BIllsList({ month }) {
  const invoices = await getBills(month);

  return (
    <Card className="col-span-1 h-96 max-sm:h-max overflow-y-auto no-scrollbar">
      <CardHeader>
        <CardTitle>Boletos</CardTitle>
        <CardDescription>Descrição</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.map((item) => (
          <div className="flex items-center gap-4 mb-4" key={item.cartao_id}>
            <div className="space-y-1">
              <p className="font-bold text-xl leading-none hover:underline">{item.descricao}</p>
              <p className="text-sm text-muted-foreground">{item.status_pagamento}</p>
              {item.status_pagamento != "Pago" && <p className="text-sm text-muted-foreground">Vence dia {item.dt_vencimento}</p>}
            </div>
            <p className="ml-auto font-bold text-lg">R$ {item.valor}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
