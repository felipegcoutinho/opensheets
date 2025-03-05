import Numbers from "@/components/numbers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, File, User, Users } from "lucide-react";
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
      <CardHeader className="flex w-full">
        <CardTitle className="flex justify-between gap-2">
          <p>{responsavel}</p>
          {responsavel === "Você" ? (
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
              <p className="font-bold">Cartões</p>
            </div>
            <p className="text-lg">
              <Numbers value={totalCartao} />
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
                        className="rounded-full shadow-lg"
                        width={20}
                        height={20}
                        alt="Logo do cartão"
                      />
                    ) : (
                      descricao === "Pix/Dinheiro/Débito" && (
                        <Image
                          quality={100}
                          src="/logos/pix.png"
                          className="rounded-full shadow-lg"
                          width={20}
                          height={20}
                          alt="Logo do Pix"
                        />
                      )
                    )}
                    {descricao}
                  </p>
                  <p>
                    <Numbers value={data.valor} />
                  </p>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">
                Sem Lançamentos registradas
              </li>
            )}
          </ul>
        </div>

        <div className="border-muted my-3 w-full border border-dashed dark:border-neutral-700"></div>

        <div className="grid">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <File size={14} />
              <p className="font-bold">Boletos</p>
            </div>
            <p className="text-lg">
              <Numbers value={totalBoleto} />
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
                    <Numbers value={valor} />
                  </span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">Sem boletos registrados</li>
            )}
          </ul>
        </div>

        <div className="border-muted my-2 w-full border-2 dark:border-neutral-700"></div>

        <div className="mt-4">
          <li className="flex items-center justify-between font-bold">
            <span className="text-muted-foreground text-lg">Total</span>
            <span className="text-xl">
              <Numbers value={totalCartao + totalBoleto} />
            </span>
          </li>
        </div>
      </CardContent>
    </Card>
  );
}
