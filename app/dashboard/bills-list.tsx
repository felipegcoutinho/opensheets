import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBills } from "../actions/bills";

export async function BIllsList({ month }) {
  const invoices = await getBills(month);

  return (
    <Card className="h-96 max-sm:h-max overflow-y-auto">
      <CardHeader>
        <CardTitle>Boletos</CardTitle>
        <CardDescription>Total de Boletos</CardDescription>
      </CardHeader>

      {invoices.map((item) => (
        <CardContent className="grid gap-2 ">
          <div className="grid">
            <div className="flex items-center justify-between">
              <span className="text-xl">{item.descricao}</span>
              <span className="">R$ {item.valor}</span>
            </div>
            <span className="text-muted-foreground text-sm">{item.status_pagamento}</span>
            {/* <InvoicePayment month={month} paramsId={item.cartao_id} /> */}
            Pagar
          </div>
        </CardContent>
      ))}
    </Card>
  );
}
