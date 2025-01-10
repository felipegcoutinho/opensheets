"use client";

import { payBills } from "@/app/actions/bills";
import Numbers from "@/components/numbers";
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
      const formData = new FormData(e.target);
      payBills(formData, id).then(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    });
  };

  if (status_pagamento === "Pago") {
    return (
      <Button className="h-6" variant="success" type="button">
        Pago
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-6" variant="warning" type="button">
          Pagar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Confirmação de Pagamento
          </DialogTitle>
          <DialogDescription className="mt-0 flex flex-col py-6 text-center text-lg">
            Você está pagando o boleto de {descricao} no valor de{" "}
            <Numbers value={valor} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full flex-row">
          <DialogClose className="w-1/2" asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>

          <form className="w-1/2" onSubmit={handlePaymentBills}>
            <Button
              className={`w-full bg-green-500 hover:bg-green-600 ${
                isPending ? "opacity-50" : ""
              }`}
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Processando..." : "Pagar Boleto"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
