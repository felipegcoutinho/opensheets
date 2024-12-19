import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UseDates } from "@/hooks/use-dates";
import { getAccount } from "@actions/accounts";
import { deleteCards, getCards, getLimite } from "@actions/cards";
import Image from "next/image";
import Link from "next/link";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

async function PageCards(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();

  // Obter os limites de todos os cartões
  const limites = await getLimite(getCardsMap.map((item) => item.id));

  return (
    <div className="w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <div className="mt-4 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {getCardsMap?.length !== 0 ? (
          getCardsMap?.map((item) => {
            const limitesCartao = limites.find(
              (limite) => limite.id === item.id,
            );

            return (
              <Card key={item.id}>
                <CardContent className="space-y-4 p-5">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        quality={100}
                        src={`/logos/${item.logo_image}`}
                        className="rounded-full shadow-lg"
                        width={45}
                        height={45}
                        alt="Logo do cartão"
                      />
                      {item.descricao}
                    </div>

                    <div className="flex space-x-1">
                      <Image
                        quality={100}
                        src={`/bandeiras/${item.bandeira}`}
                        alt={`Logo da bandeira`}
                        width={50}
                        height={50}
                      />
                    </div>
                  </CardTitle>

                  <div className="space-y-1 text-neutral-500 dark:text-neutral-300">
                    <p className="text-sm">Fecha dia {item.dt_fechamento}</p>
                    <p className="text-sm">Vence dia {item.dt_vencimento}</p>

                    <div className="flex justify-between border-t py-4 text-xs">
                      <div>
                        <p>Limite Total</p>
                        <p>
                          <Numbers number={limitesCartao.limiteTotal} />
                        </p>
                      </div>
                      <div>
                        <p>Em Uso</p>
                        <p>
                          <Numbers number={limitesCartao.limiteEmAberto} />
                        </p>
                      </div>
                      <div>
                        <p>Disponível</p>
                        <p className="text-green-500">
                          <Numbers number={limitesCartao.limiteDisponivel} />
                        </p>
                      </div>
                    </div>

                    <Progress
                      indicatorColor={"bg-black"}
                      value={
                        (limitesCartao.limiteEmAberto /
                          limitesCartao.limiteTotal) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between bg-neutral-100 px-6 py-1 text-black dark:bg-neutral-800">
                  <Button className="p-0" variant="link">
                    <Link
                      href={`/dashboard/cartao/${item.id}/${item.descricao.toLowerCase()}`}
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
                    itemLogo={item.logo_image}
                  />

                  <form action={deleteCards}>
                    <Button
                      className="p-0"
                      variant="link"
                      value={item.id}
                      name="excluir"
                    >
                      excluir
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <EmptyCard height={100} width={100} />
        )}
      </div>
    </div>
  );
}

export default PageCards;
