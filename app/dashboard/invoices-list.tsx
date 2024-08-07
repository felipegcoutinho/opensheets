import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"; // Certifique-se de importar o Link do Next.js
import { getInvoiceList } from "../actions/dashboards";
import InvoicePayment from "../cartao/invoice-payment";

export async function InvoiceList({ month }) {
  const invoices = await getInvoiceList(month);

  return (
    <Card className="col-span-1 h-96 max-sm:h-max overflow-y-auto">
      <CardHeader>
        <CardTitle>Faturas</CardTitle>
        <CardDescription>Descrição</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.map((item) => (
          <div className="flex items-center gap-4 mb-4" key={item.cartao_id}>
            <div className="space-y-1">
              <p className="font-bold text-xl leading-none hover:underline">
                <Link href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}`}>{item.descricao}</Link>
              </p>
              <p className="text-sm text-muted-foreground">{item.status_pagamento}</p>
              {item.status_pagamento != "Pago" && <p className="text-sm text-muted-foreground">Vence dia {item.dt_vencimento}</p>}
              <InvoicePayment month={month} paramsId={item.cartao_id} />
            </div>
            <p className="ml-auto font-bold text-lg">R$ {item.total_valor}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
