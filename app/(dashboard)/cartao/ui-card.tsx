import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import UpdateCard from "./modal/update-cards";
import Ping from "@/components/ping-icon";
import { PaymentMethodLogo } from "@/components/logos-on-table";

export default function UiCard({ item, getAccountMap, mostrarLimites }) {
  return (
    <Card key={item.id} className="gap-2">
      <CardContent className="space-y-2">
        <CardTitle className="flex items-center justify-between">
          <PaymentMethodLogo
            url_name={`/logos/${item.logo_image}`}
            descricao={item.descricao}
            width={50}
            height={50}
          />

          <Image
            src={`/bandeiras/${item.bandeira}`}
            alt={`Bandeiras`}
            width={36}
            height={36}
            className="rounded border"
          />
        </CardTitle>

        <div className="text-muted-foreground mt-4 flex justify-between text-sm">
          <p>
            Fecha dia <strong>{item.dt_fechamento}</strong>
          </p>
          <p>
            Vence dia <strong>{item.dt_vencimento}</strong>
          </p>
        </div>

        {mostrarLimites && item.limites && (
          <div className="border-y py-4">
            <div className="mb-2 flex justify-between text-sm">
              <div className="text-left">
                <p className="text-muted-foreground">Limite Total</p>
                <MoneyValues value={item.limites.limiteTotal} />
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Em Uso</p>
                <span className="flex items-center gap-1">
                  <Ping color={"bg-orange-400"} />
                  <MoneyValues value={item.limites.limiteEmUso} />
                </span>
              </div>

              <div className="text-right">
                <p className="text-muted-foreground">Disponível</p>
                <span className="flex items-center gap-1">
                  <Ping color={"bg-primary"} />
                  <MoneyValues value={item.limites.limiteDisponivel} />
                </span>
              </div>
            </div>

            <Progress
              primary_color="bg-orange-400"
              secondary_color="bg-primary "
              value={
                (item.limites.limiteEmUso / item.limites.limiteTotal) * 100
              }
              className="h-2 rounded-full"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button className="p-0" variant="link">
          <Link href={`/cartao/${item.id}`}>ver fatura</Link>
        </Button>

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

        {/* <form action={deleteCards}>
          <Button className="p-0" variant="link" value={item.id} name="excluir">
            excluir
          </Button>
        </form> */}
      </CardFooter>
    </Card>
  );
}
