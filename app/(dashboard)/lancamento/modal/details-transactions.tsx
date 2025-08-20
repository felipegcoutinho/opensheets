"use client";

import MoneyValues from "@/components/money-values";
import Timeline from "@/components/timeline-orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";
import UtilitiesLancamento from "../utilities-lancamento";
import ViewImage from "./view-image";

export default function DetailsTransactions({
  itemId,
  itemCondicao,
  itemDescricao,
  itemNotas,
  itemDate,
  itemResponsavel,
  itemResponsavelRole,
  itemTipoTransacao,
  itemValor,
  itemFormaPagamento,
  itemCartao,
  itemConta,
  itemQtdeParcelas,
  itemParcelaAtual,
  itemPeriodo,
  itemQtdeRecorrencia,
  itemPaid,
  itemImagemURL,
  itemCategoriaId,
  children,
}: {
  itemId: any;
  itemCondicao: any;
  itemDescricao: any;
  itemNotas: any;
  itemDate: any;
  itemResponsavel: any;
  itemResponsavelRole: any;
  itemTipoTransacao: any;
  itemValor: any;
  itemFormaPagamento: any;
  itemCartao: any;
  itemConta: any;
  itemQtdeParcelas: any;
  itemParcelaAtual: any;
  itemPeriodo: any;
  itemQtdeRecorrencia: any;
  itemPaid: any;
  itemImagemURL: any;
  itemCategoriaId: any;
  children?: React.ReactNode;
}) {
  const { isOpen, setIsOpen, MonthUppercase, calcularMesFinal } =
    UtilitiesLancamento();

  const { DateFormat } = UseDates();

  const {
    getResponsableStyle,
    getConditionIcon,
    getPaymentIcon,
    getBadgeStyle,
  } = UseStyles();

  const handleDialogClose = (val) => {
    setIsOpen(val);
  };

  const parcelaRestante = itemValor * (itemQtdeParcelas - itemParcelaAtual);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        {children ?? <span className="cursor-pointer">detalhes</span>}
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-xl">
        <Card className="gap-2 space-y-4">
          <CardHeader className="flex flex-row items-start border-b">
            <div>
              <DialogTitle className="group flex items-center gap-2 text-lg">
                #{itemId}
              </DialogTitle>
              <CardDescription>{DateFormat(itemDate)}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2">
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Descrição</span>
                  <span className="capitalize">{itemDescricao}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Período</span>
                  <span className="capitalize">
                    {MonthUppercase(itemPeriodo)}
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Forma de Pagamento
                  </span>

                  <span className="flex items-center gap-1">
                    {getPaymentIcon(itemFormaPagamento)}
                    <span className="capitalize">{itemFormaPagamento}</span>
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {itemCartao ? "Cartão" : "Conta"}
                  </span>
                  <span className="capitalize">{itemCartao ?? itemConta}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categoria</span>
                  <span className="capitalize">{itemCategoriaId}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Tipo de Transação
                  </span>
                  <span className="capitalize">
                    <Badge variant={getBadgeStyle(itemTipoTransacao)}>
                      {itemTipoTransacao}
                    </Badge>
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Condição</span>
                  {itemCondicao === "vista" ? "à vista" : itemCondicao}
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Responsável</span>
                  <span className="capitalize">
                    <Badge variant={getResponsableStyle(itemResponsavelRole)}>
                      {itemResponsavel}
                    </Badge>
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">
                    {itemPaid ? "pago" : "pendente"}
                  </span>
                </li>

                {itemNotas && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Notas</span>
                    <span className="capitalize">{itemNotas}</span>
                  </li>
                )}

                <ViewImage itemImagemURL={itemImagemURL} />
              </ul>

              <ul className="mb-6 grid gap-3">
                {itemCondicao === "parcelado" && (
                  <Timeline
                    DataCompra={itemDate}
                    ParcelaAtual={itemParcelaAtual}
                    QtdeParcela={itemQtdeParcelas}
                    DataFim={calcularMesFinal(
                      itemPeriodo,
                      itemQtdeParcelas,
                      itemParcelaAtual,
                    )}
                  />
                )}

                <Separator className="my-2" />

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Valor {itemCondicao === "parcelado" && "da Parcela"}
                  </span>
                  <span>
                    <MoneyValues value={itemValor} />
                  </span>
                </li>
                {itemCondicao === "parcelado" && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Valor Restante
                    </span>
                    <span>
                      <MoneyValues value={parcelaRestante} />
                    </span>
                  </li>
                )}
                {itemCondicao === "recorrente" && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Quantidade de Recorrências
                    </span>
                    <span className="capitalize">
                      {itemQtdeRecorrencia} meses
                    </span>
                  </li>
                )}
                {itemCondicao !== "parcelado" && <Separator className="my-2" />}
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total da Compra</span>
                  <span className="text-lg">
                    {itemCondicao === "parcelado" ? (
                      <MoneyValues value={itemValor * itemQtdeParcelas} />
                    ) : (
                      <MoneyValues value={itemValor} />
                    )}
                  </span>
                </li>
              </ul>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="w-full" type="button">
                  Entendi
                </Button>
              </DialogClose>
            </DialogFooter>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
