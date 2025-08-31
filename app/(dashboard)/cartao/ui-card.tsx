import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import Ping from "@/components/ping-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import UpdateCard from "./modal/update-cards";

type Props = {
  item: any;
  getAccountMap: any;
  mostrarLimites: boolean;
};

export default function UiCard({ item, getAccountMap, mostrarLimites }: Props) {
  return (
    <Card key={item.id} className="gap-2">
      <CardContent className="space-y-2">
        <CardTitle className="flex items-center justify-between">
          <PaymentMethodLogo
            url_name={`/logos/${item.logo_image}`}
            descricao={item.descricao}
            width={42}
            height={42}
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
                  <Ping color={"bg-secondary"} />
                  <MoneyValues value={item.limites.limiteDisponivel} />
                </span>
              </div>
            </div>

            <Progress
              primary_color="bg-orange-400"
              secondary_color="bg-secondary"
              value={
                (item.limites.limiteEmUso / item.limites.limiteTotal) * 100
              }
              className="h-4 rounded"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button className="p-0" variant="link">
          <Link href={`/cartao/${item.id}`}>ver fatura</Link>
        </Button>

        <UpdateCard item={item} getAccountMap={getAccountMap} />

        {/* <form action={deleteCards}>
          <Button className="p-0" variant="link" value={item.id} name="excluir">
            excluir
          </Button>
        </form> */}
      </CardFooter>
    </Card>
  );
}
