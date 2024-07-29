import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards, getCards } from "../actions/cards";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

async function PageCards({ month }) {
  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  const colorVariants = {
    zinc: "bg-zinc-500 ",
    red: "bg-red-500 ",
    orange: "bg-orange-500 ",
    amber: "bg-amber-500 ",
    yellow: "bg-yellow-500 ",
    lime: "bg-lime-500 ",
    green: "bg-green-500 ",
    emerald: "bg-emerald-500 ",
    teal: "bg-teal-500 ",
    cyan: "bg-cyan-500 ",
    sky: "bg-sky-500 ",
    blue: "bg-blue-500 ",
    indigo: "bg-indigo-500 ",
    violet: "bg-violet-500 ",
    purple: "bg-purple-500 ",
    fuchsia: "bg-fuchsia-500 ",
    pink: "bg-pink-500 ",
    rose: "bg-rose-500 ",
  };

  function Color({ color }) {
    return <div className={cn(colorVariants[color], "w-5 h-5 rounded-full")} />;
  }

  return (
    <div className="mt-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="grid grid-cols-4 gap-4 mt-4 ">
        {getCardsMap?.map((item) => (
          <Card className="bg-neutral-100" key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Color color={item.cor_padrao} />
                {item.descricao}
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
                    <Trash2Icon />
                  </Button>
                </form>
                <Button variant="link" className="p-0">
                  <Link href={`/cartao/${item.id}/${item.descricao.toLowerCase()}`}>Ver</Link>
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
