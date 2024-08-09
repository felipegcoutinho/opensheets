import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getInvoiceList } from "../actions/dashboards";
import InvoicePayment from "../cartao/invoice-payment";

export async function InvoiceList({ month }) {
  const invoices = await getInvoiceList(month);

  return (
    <Card className="h-96 max-sm:h-max overflow-y-auto">
      <CardHeader>
        <CardTitle>Faturas</CardTitle>
        <CardDescription>Total da faturas</CardDescription>
      </CardHeader>
      {invoices.map((item) => (
        <CardContent className="grid gap-2 ">
          <div className="grid">
            <div className="flex items-center justify-between">
              <span className="text-xl">
                <Link href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}`}>{item.descricao}</Link>
              </span>
              <span className="">R$ {item.total_valor}</span>
            </div>
            <span className="text-muted-foreground text-sm">{item.status_pagamento}</span>
            <InvoicePayment month={month} paramsId={item.cartao_id} />
          </div>
        </CardContent>
      ))}
    </Card>
  );
}
