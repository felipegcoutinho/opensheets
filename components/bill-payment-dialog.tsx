"use client";

import { payBills } from "@/app/actions/bills";
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
import confetti from "canvas-confetti";
import { CheckCircle2, CreditCard } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";

export default function BillPaymentDialog({
  id,
  descricao,
  valor,
  status_pagamento,
}) {
  const [isPending, startTransition] = useTransition();

  const handlePaymentBills = (e) => {
    e.preventDefault();
    startTransition(() => {
      payBills(id).then(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      });
    });
  };

  const isPaid = status_pagamento === "Pago";

  if (isPaid) {
    return <span className="text-green-500">pago</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-orange-500 hover:underline">
          pagar
        </span>
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
                <span>Você está pagando o boleto de:</span>
                <Image
                  src="/logos/boleto.svg"
                  className="dark:invert dark:filter"
                  width={40}
                  height={40}
                  alt="Logo do cartão"
                  quality={100}
                />
                <span className="text-foreground font-medium">{descricao}</span>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground text-sm">
                    Valor Total
                  </span>
                  <span className="text-foreground text-2xl font-semibold">
                    <MoneyValues value={valor} />
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

          <form className="flex-1" onSubmit={handlePaymentBills}>
            <input type="hidden" name="status_pagamento" defaultValue="Pago" />
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
