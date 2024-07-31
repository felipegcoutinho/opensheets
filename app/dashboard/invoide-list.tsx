import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link"; // Certifique-se de importar o Link do Next.js
import { getInvoiceList } from "../actions/dashboards";
import InvoicePayment from "../cartao/invoice-payment";

export async function InvoiceList({ month }) {
  const invoices = await getInvoiceList(month);

  // {invoices.map((item) => (
  //     <Card className="flex gap-2 mt-2" key={item.cartao_id}>
  //       <Link href={/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}}>{item.descricao}</Link>
  //       <div>{item.total_valor}</div>
  //       <div>{item.status_pagamento}</div>
  //       <div>{item.dt_vencimento}</div>
  //
  //     </Card>
  //   ))}

  return (
    <Card className="space-y-8 p-8">
      {invoices.map((item) => (
        <div className="flex items-center gap-4" key={item.cartao_id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              <Link href={`/cartao/${item.cartao_id}/${item.descricao.toLowerCase()}`}>{item.descricao}</Link>
            </p>
            <p className="text-sm text-muted-foreground">{item.status_pagamento}</p>
            <p className="text-sm text-muted-foreground">{item.dt_vencimento}</p>
            <InvoicePayment month={month} paramsId={item.cartao_id} />
          </div>
          <div className="ml-auto font-medium">R$ {item.total_valor}</div>
        </div>
      ))}
    </Card>
  );
}
