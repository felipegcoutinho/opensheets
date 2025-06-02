import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Barcode, CreditCard, User, Users, Verified } from "lucide-react";
import Image from "next/image";

interface UserCardHeaderProps {
  responsavel: string;
}

export default function UsersCard({
  responsavel,
  cartoes,
  totalCartao,
  boletos,
  totalBoleto,
}) {
  const hasCartoesData = Object.keys(cartoes).length > 0;
  const hasBoletosData = Object.keys(boletos).length > 0;

  const isCurrentUser = responsavel === "você";

  const getUserIcon = () => {
    return isCurrentUser ? (
      <User
        className="text-blue-600 dark:text-blue-400"
        size={24}
        aria-label="Usuário atual"
      />
    ) : (
      <Users
        className="text-orange-600 dark:text-orange-400"
        size={24}
        aria-label="Outros usuários"
      />
    );
  };
  return (
    <Card className="gap-4 overflow-hidden">
      <CardHeader>
        <div
          className={`${isCurrentUser ? "bg-blue-50 dark:bg-blue-900/30" : "bg-orange-50 dark:bg-orange-900/30"} flex justify-between rounded-lg p-4`}
        >
          {/* User Name and Badge */}
          <div className="flex items-center gap-1">
            <CardTitle className="text-center capitalize">
              {responsavel}
            </CardTitle>
            {isCurrentUser && (
              <Verified
                className="text-blue-500"
                size={18}
                aria-label="Usuário verificado"
              />
            )}
          </div>

          {/* Avatar Circle */}
          <div className="relative">{getUserIcon()}</div>
        </div>
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
