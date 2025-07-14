"use client";

import { payBills } from "@/app/actions/transactions/update_transactions";
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
import confetti from "canvas-confetti";
import Image from "next/image";
import { useTransition } from "react";

interface BillPaymentDialogProps {
  id: number;
  descricao: string;
  valor: number;
  status_pagamento: boolean;
}

export default function BillPaymentDialog({
  id,
  descricao,
  valor,
  status_pagamento,
}: BillPaymentDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handlePaymentBills = (e) => {
    e.preventDefault();
    startTransition(() => {
      payBills(id, status_pagamento).then(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      });
    });
  };

  const isPaid = status_pagamento === true;

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
                <span>Você está pagando o boleto de:</span>
                <Image
                  src="/logos/boleto.svg"
                  className="transition-transform hover:scale-105 dark:invert dark:filter"
                  width={40}
                  height={40}
                  alt="Logo do boleto"
                  quality={100}
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

          <form className="w-full sm:w-1/2" onSubmit={handlePaymentBills}>
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
