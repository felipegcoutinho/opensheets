import CardColor, { ColorDot } from "@/components/card-color";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
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

async function PageCards(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  return (
    <div className="w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="mt-4 grid grid-cols-3 gap-4">
        {getCardsMap?.length !== 0 ? (
          getCardsMap?.map((item) => (
            <CardColor aparencia={item.aparencia} key={item.id}>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <ColorDot
                    aparencia={item.aparencia}
                    descricao={item.descricao}
                  />
                  <div className="flex space-x-1">
                    <Image
                      className="mt-0"
                      src={getCardLogo(item.bandeira)}
                      alt={`Logo da bandeira ${item.bandeira}`}
                      width={65}
                      height={65}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">Fecha dia {item.dt_fechamento}</p>
                  <p className="text-sm">Vence dia {item.dt_vencimento}</p>
                  <p className="text-sm">
                    Limite Total <Numbers number={item.limite} />
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-black px-6 py-1 text-white dark:bg-neutral-700">
                <Button className="p-0 font-bold" variant="link">
                  <Link
                    className="p-0 font-bold text-white"
                    href={`/cartao/${item.id}/${item.descricao.toLowerCase()}`}
                  >
                    fatura
                  </Link>
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
                  <Button
                    className="p-0 font-bold text-white"
                    variant="link"
                    value={item.id}
                    name="excluir"
                  >
                    excluir
                  </Button>
                </form>
              </CardFooter>
            </CardColor>
          ))
        ) : (
          <EmptyCard height={100} width={100} />
        )}
      </div>
    </div>
  );
}

export default PageCards;
