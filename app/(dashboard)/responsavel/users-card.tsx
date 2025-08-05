import MoneyValues from "@/components/money-values";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
import { Badge } from "@/components/ui/badge";
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
  RiBankCardFill,
  RiBarcodeLine,
  RiGroupLine,
  RiUserLine,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import Image from "next/image";

type UsersCardProps = {
  responsavel: string;
  cartoes: Record<
    string,
    { valor: number; logo_image?: string; dt_vencimento?: string }
  >;
  totalCartao: number;
  boletos: Record<string, { valor: number; data_vencimento?: string }>;
  totalBoleto: number;
};

export default function UsersCard({
  responsavel,
  cartoes,
  totalCartao,
  boletos,
  totalBoleto,
}: UsersCardProps) {
  const hasCartoesData = Object.keys(cartoes).length > 0;
  const hasBoletosData = Object.keys(boletos).length > 0;
  const { DateFormat } = UseDates();

  const isCurrentUser = responsavel === "você";

  const bgCurrentUser =
    "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20";

  const bgOtherUser =
    "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20";

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
    <Card
      className={`relative cursor-pointer overflow-hidden border-none transition-all duration-300 hover:scale-105 ${
        isCurrentUser ? bgCurrentUser : bgOtherUser
      }`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <CardHeader className="cursor-pointer text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="py-10">{getUserIcon()}</div>

              <CardTitle className="text-xl capitalize">
                {responsavel}
              </CardTitle>

              {isCurrentUser && (
                <RiVerifiedBadgeFill
                  className="text-blue-500"
                  size={16}
                  aria-label="Usuário verificado"
                />
              )}
            </div>

            <span className="text-sm">ver</span>
          </CardHeader>
        </DialogTrigger>

        <DialogContent className="p-8 text-sm">
          <DialogHead>
            <DialogHeading
              className={`rounded p-5 text-center capitalize ${
                isCurrentUser ? bgCurrentUser : bgOtherUser
              }`}
            >
              {responsavel}
            </DialogHeading>
          </DialogHead>

          {hasCartoesData && (
            <section className="grid">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <RiBankCardFill size={14} />
                  <span className="font-bold">Cartões</span>
                </div>
                <span className="text-lg">
                  <MoneyValues value={totalCartao} />
                </span>
              </div>

              <ul className="mt-4 grid gap-2">
                {Object.entries(cartoes).map(([descricao, data]) => (
                  <li
                    className="text-muted-foreground flex items-center justify-between"
                    key={descricao}
                  >
                    <div className="flex items-center gap-1">
                      {data.logo_image ? (
                        <PaymentMethodLogo
                          url_name={`/logos/${data.logo_image}`}
                          descricao={descricao}
                          width={28}
                          height={28}
                        />
                      ) : (
                        descricao === "Pix/Dinheiro/Débito" && (
                          <PaymentMethodLogo
                            url_name={`/logos/pix.png`}
                            descricao={descricao}
                            width={28}
                            height={28}
                          />
                        )
                      )}

                      {data.dt_vencimento && (
                        <span className="text-xs font-bold">
                          <Badge variant={"outline"}>
                            vence dia {data.dt_vencimento}
                          </Badge>
                        </span>
                      )}
                    </div>
                    <p>
                      <MoneyValues value={data.valor} />
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasCartoesData && (
            <div className="border-muted my-1 w-full border border-dashed dark:border-neutral-700"></div>
          )}

          {hasBoletosData && (
            <section className="grid">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <RiBarcodeLine size={14} />
                  <span className="font-bold">Boletos</span>
                </div>
                <span className="text-lg">
                  <MoneyValues value={totalBoleto} />
                </span>
              </div>

              <ul className="mt-4 grid gap-2">
                {Object.entries(boletos).map(([descricao, data]) => (
                  <li
                    className="text-muted-foreground flex items-center justify-between"
                    key={descricao}
                  >
                    <span className="flex items-center gap-1">
                      <Image
                        quality={100}
                        src="/logos/boleto.svg"
                        className="dark:invert dark:filter"
                        width={28}
                        height={28}
                        alt="Logo do Boleto"
                      />
                      {descricao}

                      {data.data_vencimento && (
                        <Badge variant={"outline"}>
                          vence {DateFormat(data.data_vencimento)}
                        </Badge>
                      )}
                    </span>
                    <span>
                      <MoneyValues value={data.valor} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasBoletosData && (
            <div className="border-muted w-full border border-dashed dark:border-neutral-700"></div>
          )}

          <div className="py-2">
            <span className="flex items-center justify-between">
              <span className="text-muted-foreground text-lg">Total</span>
              <span className="text-xl">
                <MoneyValues value={totalCartao + totalBoleto} />
              </span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
