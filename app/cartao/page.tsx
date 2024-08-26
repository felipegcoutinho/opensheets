import CardColor, { ColorDot } from "@/components/card-color";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { UseDates } from "@/hooks/UseDates";
import mastercard from "@/public/mastercard.svg";
import visa from "@/public/visa.svg";
import Image from "next/image";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards, getCards } from "../actions/cards";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

async function PageCards({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="grid grid-cols-4 gap-4 mt-4">
        {getCardsMap?.map((item) => (
          <CardColor aparencia={item.aparencia} id={item.id}>
            <CardHeader className="flex-row justify-between">
              <ColorDot aparencia={item.aparencia} descricao={item.descricao} />
              <CardDescription>
                <Image className="mt-0" src={item.bandeira === "Mastercard" ? mastercard : visa} alt="Logo da Bandeira" width={65} height={65} />
              </CardDescription>
            </CardHeader>
            <CardContent className="leading-relaxed">
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
          </CardColor>
        ))}
      </div>
    </div>
  );
}

export default PageCards;
