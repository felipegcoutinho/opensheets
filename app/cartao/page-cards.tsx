import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards, getCards } from "../actions/cards";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

async function PageCards({ month }) {
  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {getCardsMap?.map((item) => (
          // <Card key={item.id} className={cn(colorVariantsCard[item.aparencia])}>
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {/* <div className={cn(colorVariants[item.aparencia], "w-5 h-5 rounded-full")} /> */}
                {item.descricao}
              </CardTitle>
              {/* <InvoicePayment month={month} paramsId={item.id} /> */}
              <CardDescription>{item.bandeira}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <span className="flex items-center gap-2">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <p className="text-green-500 text-sm">ativo</p>
              </span> */}
              <p className="text-sm">Fecha dia {item.dt_fechamento}</p>
              <p className="text-sm">Vence dia {item.dt_vencimento}</p>
              <p className="text-sm">Cartão {item.tipo}</p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-4">
                <UpdateCard
                  itemContaId={item.contas?.id}
                  itemDescricao={item.descricao}
                  itemBandeira={item.bandeira}
                  itemTipo={item.tipo}
                  itemId={item.id}
                  itemLimite={item.limite}
                  itemStatusPagamento={item.status_pagamento}
                  itemDtFechamento={item.dt_fechamento}
                  itemDtPagamento={item.dt_pagamento}
                  itemDtVencimento={item.dt_vencimento}
                  itemAnotacao={item.anotacao}
                  getAccountMap={getAccountMap}
                  itemAparencia={item.aparencia}
                />
                <form action={deleteCards}>
                  <Button className="p-0" variant="link" value={item.id} name="excluir">
                    excluir
                  </Button>
                </form>
                <Button className="p-0" variant="link">
                  <Link href={`/cartao/${item.id}/${item.descricao.toLowerCase()}`}>fatura</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PageCards;
