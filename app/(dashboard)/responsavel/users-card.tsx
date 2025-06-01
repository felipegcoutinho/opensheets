import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Barcode, CreditCard, User, Users } from "lucide-react";
import Image from "next/image";

export default function UsersCard({
  responsavel,
  cartoes,
  totalCartao,
  boletos,
  totalBoleto,
}) {
  const hasCartoesData = Object.keys(cartoes).length > 0;
  const hasBoletosData = Object.keys(boletos).length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <p className="text-xl capitalize">{responsavel}</p>
          {responsavel === "você" ? (
            <User className="text-blue-600" size={22} />
          ) : (
            <Users className="text-orange-600" size={22} />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm">
        <div className="grid">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <CreditCard size={14} />
              <p>Cartões</p>
            </div>
            <p className="text-lg">
              <MoneyValues value={totalCartao} />
            </p>
          </li>

          <ul className="grid gap-2 p-2">
            {hasCartoesData ? (
              Object.entries(cartoes).map(([descricao, data]) => (
                <li
                  className="text-muted-foreground flex items-center justify-between space-y-1 leading-relaxed"
                  key={descricao}
                >
                  <p className="flex items-center gap-1">
                    {data.logo_image ? (
                      <Image
                        quality={100}
                        src={`/logos/${data.logo_image}`}
                        className="rounded-full border shadow-sm transition-transform hover:scale-105"
                        width={20}
                        height={20}
                        alt="Logo do cartão"
                      />
                    ) : (
                      descricao === "Pix/Dinheiro/Débito" && (
                        <Image
                          quality={100}
                          src="/logos/pix.png"
                          className="rounded-full border shadow-sm transition-transform hover:scale-105"
                          width={20}
                          height={20}
                          alt="Logo do Pix"
                        />
                      )
                    )}
                    {descricao}
                  </p>
                  <p>
                    <MoneyValues value={data.valor} />
                  </p>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">
                Sem Lançamentos registrados
              </li>
            )}
          </ul>
        </div>

        <div className="border-muted my-3 w-full border border-dashed dark:border-neutral-700"></div>

        <div className="grid">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Barcode size={14} />
              <p>Boletos</p>
            </div>
            <p className="text-lg">
              <MoneyValues value={totalBoleto} />
            </p>
          </li>

          <ul className="grid gap-2 p-2">
            {hasBoletosData ? (
              Object.entries(boletos).map(([descricao, valor]) => (
                <li
                  className="text-muted-foreground flex items-center justify-between space-y-1 leading-relaxed"
                  key={descricao}
                >
                  <span className="flex items-center gap-1">
                    <Image
                      quality={100}
                      src="/logos/boleto.svg"
                      className="dark:invert dark:filter"
                      width={20}
                      height={20}
                      alt="Logo do Boleto"
                    />
                    {descricao}
                  </span>
                  <span>
                    <MoneyValues value={valor} />
                  </span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">Sem boletos registrados</li>
            )}
          </ul>
        </div>

        <div className="border-muted my-2 w-full border dark:border-neutral-700"></div>

        <div className="mt-4">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground text-lg">Total</span>
            <span className="text-xl">
              <MoneyValues value={totalCartao + totalBoleto} />
            </span>
          </li>
        </div>
      </CardContent>
    </Card>
  );
}
