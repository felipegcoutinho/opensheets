"use client";

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
import { CheckCircle2, CreditCard } from "lucide-react";
import Image from "next/image";
import Numbers from "./numbers";
import Utils from "./utils";

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
    (item) => item.status_pagamento === "Pago",
  );

  if (isPaid) {
    return (
      <Button className="h-6 gap-1" variant="success" type="button">
        <CheckCircle2 className="h-4 w-4" />
        <span>Pago</span>
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-6 gap-1" variant="warning" type="button">
          <CreditCard className="h-4 w-4" />
          Pagar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <CreditCard className="h-5 w-5" />
            Confirmação de Pagamento
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-4">
              <div className="flex flex-col items-center gap-2 text-base">
                <span>Você está pagando a fatura de:</span>
                <Image
                  src={`/logos/${logo_imagem}`}
                  className="rounded-full"
                  width={40}
                  height={40}
                  alt="Logo do cartão"
                  quality={100}
                />
                <span className="font-medium text-foreground">{descricao}</span>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm text-muted-foreground">
                    Valor Total
                  </span>
                  <span className="text-2xl font-semibold text-foreground">
                    <Numbers value={valor} />
                  </span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" type="button">
              Cancelar
            </Button>
          </DialogClose>

          <form className="flex-1" onSubmit={handlePaymentInvoices}>
            <input type="hidden" name="status_pagamento" defaultValue="Pago" />
            <input type="hidden" name="periodo" defaultValue={month} />
            <input type="hidden" name="cartao_id" defaultValue={cartao_id} />

            <Button
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="ml-2">Processando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Confirmar Pagamento</span>
                </>
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
