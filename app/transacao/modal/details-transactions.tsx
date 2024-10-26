"use client";

import Numbers from "@/components/numbers";
import Timeline from "@/components/timeline-orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UseDates } from "@/hooks/use-dates";
import Utils from "../utils";

export default function DetailsTransactions({
  itemId,
  itemCategoria,
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
  itemRecorrencia,
  itemQtdeRecorrencia,
  itemPaid,
}) {
  const { isOpen, setIsOpen, MonthUppercase, calcularMesFinal } = Utils();

  const { DateFormat } = UseDates();

  const handleDialogClose = (val) => {
    setIsOpen(val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger>Detalhes</DialogTrigger>

      <DialogContent className="p-0">
        <Card className="space-y-4 p-1">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                #{itemId}
              </CardTitle>
              <CardDescription>{DateFormat(itemDate)}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="py-0 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Detalhes da Transação</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Descrição</span>
                  <span>{itemDescricao}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Período</span>
                  <span>{MonthUppercase(itemPeriodo)}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Forma de Pagamento
                  </span>
                  <span>{itemFormaPagamento}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {itemCartao ? "Cartão" : "Conta"}
                  </span>
                  <span>{itemCartao ?? itemConta}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categoria</span>
                  <span>{itemCategoria}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Tipo de Transação
                  </span>
                  <span>{itemTipoTransacao}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Condição</span>
                  <span>{itemCondicao}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Responsável</span>
                  <span>{itemResponsavel}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span>{itemPaid ? "Pago" : "Pendente"}</span>
                </li>

                {itemNotas && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Notas</span>
                    <span>{itemNotas}</span>
                  </li>
                )}
              </ul>

              <ul className="mb-6 grid gap-3">
                {itemCondicao === "Parcelado" && (
                  <Timeline
                    DataCompra={itemDate}
                    ParcelaAtual={itemParcelaAtual}
                    QtdeParcela={itemQtdeParcelas}
                    DataFim={calcularMesFinal(itemPeriodo, itemQtdeParcelas)}
                  />
                )}

                <Separator className="my-2" />

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Valor {itemCondicao === "Parcelado" && "da Parcela"}
                  </span>
                  <span>
                    <Numbers number={itemValor} />
                  </span>
                </li>

                {itemCondicao === "Recorrente" && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Quantidade de Recorrências
                    </span>
                    <span>{itemQtdeRecorrencia} meses</span>
                  </li>
                )}

                {itemCondicao !== "Parcelado" && <Separator className="my-2" />}

                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total da Compra</span>
                  <span className="text-lg">
                    {itemCondicao === "Parcelado" ? (
                      <Numbers number={itemValor * itemQtdeParcelas} />
                    ) : (
                      <Numbers number={itemValor} />
                    )}
                  </span>
                </li>
              </ul>
            </div>
            <DialogFooter className="mb-4">
              <DialogClose asChild>
                <Button className="w-full" type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
