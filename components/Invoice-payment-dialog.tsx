"use client";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiBankCardLine } from "@remixicon/react";
import Utils from "./utils";
import { PaymentMethodLogo } from "./logos-on-table";

export default function InvoicePaymentDialog({
  fatura_status,
  month,
  cartao_id,
  descricao,
  valor,
  logo_imagem,
}) {
  const { handlePaymentInvoices, isPending } = Utils();

  const isPaid = fatura_status?.some(
    (item) => item.status_pagamento === "pago",
  );

  if (isPaid) {
    return <span className="text-green-500">pago</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-orange-400 hover:underline">
          pagar
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <RiBankCardLine className="h-5 w-5" />
            Confirmação de Pagamento
          </DialogTitle>

          <DialogDescription className="text-foreground" asChild>
            <div className="space-y-4 pt-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <span>Você está pagando a fatura de:</span>
                <PaymentMethodLogo
                  url_name={`/logos/${logo_imagem}`}
                  width={40}
                  height={40}
                />
                <span className="font-bold">{descricao}</span>
              </div>

              <div className="border p-6">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm">Valor Total</span>
                  <span className="text-2xl font-semibold">
                    <MoneyValues value={valor} />
                  </span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <DialogClose asChild>
            <Button
              className="w-full sm:w-1/2"
              type="button"
              variant="secondary"
            >
              Cancelar
            </Button>
          </DialogClose>

          <form className="w-full sm:w-1/2" onSubmit={handlePaymentInvoices}>
            <input type="hidden" name="status_pagamento" defaultValue="pago" />
            <input type="hidden" name="periodo" defaultValue={month} />
            <input type="hidden" name="cartao_id" defaultValue={cartao_id} />

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="ml-2">Processando...</span>
                </>
              ) : (
                <span>Pagar</span>
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
