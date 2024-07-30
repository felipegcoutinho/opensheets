import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UseColors } from "@/hooks/UseColors";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards, getCards } from "../actions/cards";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

async function PageCards({ month }) {
  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();
  const { colorVariants, colorVariantsCard } = UseColors();

  return (
    <div className="mt-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {getCardsMap?.map((item) => (
          <Card key={item.id} className={cn(colorVariantsCard[item.cor_padrao])}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={cn(colorVariants[item.cor_padrao], "w-5 h-5 rounded-full")} />
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
                  itemCorPadrao={item.cor_padrao}
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
