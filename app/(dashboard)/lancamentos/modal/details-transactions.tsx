"use client";

import MoneyValues from "@/components/money-values";
import Timeline from "@/components/timeline-orders";
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
import UtilitiesLancamento from "../utilities-lancamento";
import ViewImage from "./view-image";

export default function DetailsTransactions({
  itemId,
  itemCondicao,
  itemDescricao,
  itemNotas,
  itemDate,
  itemResponsavel,
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
}) {
  const { isOpen, setIsOpen, MonthUppercase, calcularMesFinal } =
    UtilitiesLancamento();

  const { DateFormat } = UseDates();

  const handleDialogClose = (val) => {
    setIsOpen(val);
  };

  const parcelaRestante = itemValor * (itemQtdeParcelas - itemParcelaAtual);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger>
        <span className="cursor-pointer">Detalhes</span>
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
                  <span className="capitalize">{itemFormaPagamento}</span>
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
                  <span className="capitalize">{itemTipoTransacao}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Condição</span>
                  <span className="capitalize">{itemCondicao}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Responsável</span>
                  <span className="capitalize">{itemResponsavel}</span>
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
            <DialogFooter className="mb-4">
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
