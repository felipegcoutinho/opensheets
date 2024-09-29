import { ColorDot } from "@/components/card-color";
import EmptyCard from "@/components/empty-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import mastercard from "@/public/mastercard.svg";
import visa from "@/public/visa.svg";
import vuon from "@/public/vuon.svg";
import Image from "next/image";
import Link from "next/link";
import { getAccount } from "../actions/accounts";
import { deleteCards, getCards } from "../actions/cards";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

// Função para gerenciar os logos de bandeiras
function getCardLogo(bandeira) {
  switch (bandeira) {
    case "Mastercard":
      return mastercard;
    case "Visa":
      return visa;
    case "Vuoncard":
      return vuon;
    default:
      return null; // Caso não tenha logo correspondente, pode retornar null ou um logo padrão.
  }
}

async function PageCards({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="grid grid-cols-3 gap-4 mt-4">
        {getCardsMap?.length !== 0 ? (
          getCardsMap?.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <ColorDot aparencia={item.aparencia} descricao={item.descricao} />
                  <div className="flex space-x-1">
                    <Image className="mt-0" src={getCardLogo(item.bandeira)} alt={`Logo da bandeira ${item.bandeira}`} width={65} height={65} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Fecha dia {item.dt_fechamento}</p>
                  <p className="text-sm">Vence dia {item.dt_vencimento}</p>
                  <p className="text-sm">Cartão {item.tipo}</p>
                </div>
              </CardContent>
              <CardFooter className="py-1 px-6 flex justify-between">
                <Button className="p-0 font-bold" variant="link">
                  <Link href={`/cartao/${item.id}/${item.descricao.toLowerCase()}`}>fatura</Link>
                </Button>

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
              </CardFooter>
            </Card>
          ))
        ) : (
          <EmptyCard height={100} width={100} />
        )}
      </div>
    </div>
  );
}

export default PageCards;
