import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards, getCards } from "../actions/cards";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

const colorVariants = {
  lime: "bg-lime-500 hover:bg-lime-500 text-white",
  purple: "bg-purple-500 hover:bg-purple-500 text-white",
  orange: "bg-orange-500 hover:bg-orange-500 text-white",
};

function Color({ color }) {
  return <div className={cn(colorVariants[color], "w-6 h-6 rounded-full")} />;
}

async function PageCards({ month }) {
  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {getCardsMap?.map((item) => (
          <Card className="bg-neutral-100" key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Color color={item.cor_padrao} />
                <Link href={`/cartoes/${item.id}/${item.descricao}?periodo=${month}`}>{item.descricao}</Link>
              </CardTitle>
              <CardDescription>{item.bandeira}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.tipo}</p>
              <p className="text-sm">Fechamento: Dia {item.dt_fechamento}</p>
              <p className="text-sm">Vencimento: Dia {item.dt_vencimento}</p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
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
                  itemCorPadrao={item.cor_padrao}
                />
                <form action={deleteCards}>
                  <Button variant="link" value={item.id} name="excluir">
                    <Trash2Icon className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PageCards;
