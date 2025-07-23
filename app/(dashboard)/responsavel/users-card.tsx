import MoneyValues from "@/components/money-values";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as DialogHead,
  DialogTitle as DialogHeading,
} from "@/components/ui/dialog";
import { UseDates } from "@/hooks/use-dates";
import {
  RiBankCardLine,
  RiBarcodeLine,
  RiGroupLine,
  RiUserLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";
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
  const { DateFormat } = UseDates();

  const isCurrentUser = responsavel === "você";

  const getUserIcon = () => {
    return isCurrentUser ? (
      <RiUserLine
        className="text-blue-600 dark:text-blue-400"
        size={24}
        aria-label="Usuário atual"
      />
    ) : (
      <RiGroupLine
        className="text-orange-600 dark:text-orange-400"
        size={24}
        aria-label="Outros usuários"
      />
    );
  };
  return (
    <Card className="overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <CardHeader className="cursor-pointer">
            <div
              className={`${isCurrentUser ? "bg-blue-50 dark:bg-blue-900/30" : "bg-orange-50 dark:bg-orange-900/30"} flex justify-between rounded-lg p-4`}
            >
              <div className="flex items-center gap-1">
                <CardTitle className="text-center capitalize">
                  {responsavel}
                </CardTitle>
                {isCurrentUser && (
                  <RiVerifiedBadgeLine
                    className="text-blue-500"
                    size={18}
                    aria-label="Usuário verificado"
                  />
                )}
              </div>
              <div className="relative">{getUserIcon()}</div>
            </div>
          </CardHeader>
        </DialogTrigger>

        <DialogContent className="text-sm">
          <DialogHead>
            <DialogHeading className="capitalize">{responsavel}</DialogHeading>
          </DialogHead>

          <div className="grid">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <RiBankCardLine size={14} />
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
                    <div className="flex items-center gap-1">
                      {data.logo_image ? (
                        <PaymentMethodLogo
                          url_name={`/logos/${data.logo_image}`}
                          descricao={descricao}
                          width={24}
                          height={24}
                        />
                      ) : (
                        descricao === "Pix/Dinheiro/Débito" && (
                          <PaymentMethodLogo
                            url_name={`/logos/pix.png`}
                            descricao={descricao}
                            width={24}
                            height={24}
                          />
                        )
                      )}
                      {data.dt_vencimento && (
                        <span className="text-xs">
                          dia {data.dt_vencimento}
                        </span>
                      )}
                    </div>
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
                <RiBarcodeLine size={14} />
                <p>Boletos</p>
              </div>
              <p className="text-lg">
                <MoneyValues value={totalBoleto} />
              </p>
            </li>

            <ul className="grid gap-2 p-2">
              {hasBoletosData ? (
                Object.entries(boletos).map(([descricao, data]) => (
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
                      {data.data_vencimento && (
                        <span className="text-xs">
                          {DateFormat(data.data_vencimento)}
                        </span>
                      )}
                    </span>
                    <span>
                      <MoneyValues value={data.valor} />
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">
                  Sem boletos registrados
                </li>
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
        </DialogContent>
      </Dialog>
    </Card>
  );
}
