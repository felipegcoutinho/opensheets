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
import {
  RiBankCardLine,
  RiBarcodeLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import { useState } from "react";
import UtilitiesComponents from "./utilities-components";

type BillPaymentDialogProps = {
  id: string;
  descricao: string;
  valor: number;
  status_pagamento: boolean;
};

export default function BillPaymentDialog({
  id,
  descricao,
  valor,
  status_pagamento,
}: BillPaymentDialogProps) {
  const { handlePaymentBills, isPending } = UtilitiesComponents();
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "error" | null
  >(null);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await handlePaymentBills(id, status_pagamento);
    if (response.success) {
      setPaymentStatus("success");
    } else {
      setPaymentStatus("error");
    }
  };

  const resetState = () => {
    setPaymentStatus(null);
  };

  const isPaid = status_pagamento === true;

  if (isPaid) {
    return <span className="text-emerald-600">pago</span>;
  }

  return (
    <Dialog onOpenChange={resetState}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-orange-600 hover:underline">
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
                <RiBarcodeLine size={32} />
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

        {paymentStatus === "success" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <RiCheckboxCircleLine className="h-12 w-12 text-emerald-600" />
            <p>Pagamento realizado com sucesso!</p>
            <DialogClose asChild>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                Concluído
              </Button>
            </DialogClose>
          </div>
        ) : paymentStatus === "error" ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <RiErrorWarningLine className="h-12 w-12 text-red-500" />
            <p>Ocorreu um erro ao processar o pagamento.</p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600"
              onClick={() => setPaymentStatus(null)}
            >
              Tentar Novamente
            </Button>
          </div>
        ) : (
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

            <form className="w-full sm:w-1/2" onSubmit={handlePayment}>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
