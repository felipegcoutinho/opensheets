import { deleteCards } from "@/actions/cards";
import { getCards, getCardsDisabled } from "@/app/services/cartoes";
import { getAccount } from "@/app/services/contas";
import { getLimitesCartao } from "@/app/services/transacoes";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import Ping from "@/components/ping-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonth } from "@/hooks/get-month";
import { Lock, LockOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CreateCard from "./modal/create-cards";
import UpdateCard from "./modal/update-cards";

function verificarCartaoFechado(dtFechamento) {
  const hoje = new Date();
  const diaAtual = hoje.getDate();

  return diaAtual >= dtFechamento ? (
    <Lock size={14} className="text-red-500" />
  ) : (
    <LockOpen size={14} className="text-green-500" />
  );
}

function CartaoCard({ item, getAccountMap, mostrarLimites }) {
  return (
    <Card key={item.id}>
      <CardContent className="space-y-4 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              quality={100}
              src={`/logos/${item.logo_image}`}
              className="rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
              width={50}
              height={50}
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

        <div className="text-muted-foreground space-y-1">
          <p className="flex items-center text-sm">
            Fecha dia {item.dt_fechamento}
            <span className="ml-1">
              {verificarCartaoFechado(item.dt_fechamento)}
            </span>
          </p>
          <p className="text-sm">Vence dia {item.dt_vencimento}</p>

          {mostrarLimites && item.limites && (
            <>
              <div className="flex justify-between py-3 text-xs">
                <div>
                  <p>Limite Total</p>
                  <p>
                    <MoneyValues value={item.limites.limiteTotal} />
                  </p>
                </div>
                <div>
                  <p>Em Uso</p>
                  <p>
                    <MoneyValues value={item.limites.limiteEmUso} />
                  </p>
                </div>
                <div>
                  <p>Disponível</p>
                  <p className="text-green-500">
                    <MoneyValues value={item.limites.limiteDisponivel} />
                  </p>
                </div>
              </div>

              <Progress
                indicatorColor="bg-chart-2"
                value={
                  (item.limites.limiteEmUso / item.limites.limiteTotal) * 100
                }
                className="h-2 rounded-full"
              />
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-6 py-1">
        {mostrarLimites ? (
          <Button className="p-0" variant="link">
            <Link href={`/cartao/${item.id}/${item.descricao.toLowerCase()}`}>
              fatura
            </Link>
          </Button>
        ) : (
          <div />
        )}

        <UpdateCard
          itemContaId={item.contas?.id}
          itemDescricao={item.descricao}
          itemBandeira={item.bandeira}
          itemTipo={item.tipo}
          itemId={item.id}
          itemLimite={item.limite}
          itemStatus={item.status}
          itemDtFechamento={item.dt_fechamento}
          itemDtPagamento={item.dt_pagamento}
          itemDtVencimento={item.dt_vencimento}
          itemAnotacao={item.anotacao}
          getAccountMap={getAccountMap}
          itemLogo={item.logo_image}
        />

        <form action={deleteCards}>
          <Button className="p-0" variant="link" value={item.id} name="excluir">
            excluir
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

async function page(props) {
  const month = await getMonth(props);

  const cartoesAtivos = await getCards();
  const cartoesInativos = await getCardsDisabled();
  const getAccountMap = await getAccount();

  const cardsWithLimits = await Promise.all(
    cartoesAtivos?.map(async (card) => {
      const limites = await getLimitesCartao(card.id, card.limite);
      return { ...card, limites };
    }),
  );

  return (
    <div className="w-full">
      <CreateCard getAccountMap={getAccountMap} />

      <Tabs defaultValue="ativos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ativos">
            <Ping color="bg-green-500" /> Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos">
            <Ping color="bg-zinc-400" /> Inativos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {cardsWithLimits?.length !== 0 ? (
              cardsWithLimits.map((item) => (
                <CartaoCard
                  key={item.id}
                  item={item}
                  getAccountMap={getAccountMap}
                  mostrarLimites={true}
                />
              ))
            ) : (
              <EmptyCard height={100} width={100} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="inativos">
          <div className="grid gap-4 saturate-0 sm:grid-cols-1 lg:grid-cols-3">
            {cartoesInativos?.length !== 0 ? (
              cartoesInativos.map((item) => (
                <CartaoCard
                  key={item.id}
                  item={item}
                  getAccountMap={getAccountMap}
                  mostrarLimites={false}
                />
              ))
            ) : (
              <EmptyCard height={100} width={100} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default page;
