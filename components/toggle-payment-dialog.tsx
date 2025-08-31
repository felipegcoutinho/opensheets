"use client";

import { togglePagamento, payBills } from "@/app/actions/transactions/update_transactions";
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
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";

type TogglePaymentDialogProps = {
  onStatusChanged: (status: boolean) => void;
  item: {
    id: string;
    realizado: boolean;
    periodo: string;
    forma_pagamento: string;
    cartoes?: {
      id: string;
    };
  };
};

export default function TogglePaymentDialog({
  onStatusChanged,
  item,
}: TogglePaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const id = item.id;
  const realizadoAtual = item.realizado;
  const periodo = item.periodo;
  const formaPagamento = item.forma_pagamento;
  const cartaoId = item.cartoes?.id;

  const isCartaoCredito = formaPagamento === "cartão de crédito";
  const isPago = realizadoAtual;

  const handleToggle = async (e) => {
    e.preventDefault();
    setLoading(true);

    let error: any = null;
    if (formaPagamento === "boleto") {
      const res = await payBills(id, realizadoAtual);
      if (!res.success) error = res.message || true;
    } else if (!isCartaoCredito) {
      const r = await togglePagamento(id, realizadoAtual);
      error = r?.error || null;
    }

    if (!error) {
      onStatusChanged(!realizadoAtual);
      setOpen(false);
    }

    setLoading(false);
  };

  const labelStatus = isPago ? (
    <RiThumbUpFill size={16} />
  ) : (
    <RiThumbDownFill className="text-muted-foreground" size={16} />
  );
  const dialogTitle = isCartaoCredito
    ? "Pagamento via cartão"
    : isPago
      ? "Desfazer pagamento?"
      : "Marcar como pago?";

  const dialogMessage = isCartaoCredito ? (
    <span className="space-y-4">
      <span>
        Pagamentos com <strong>cartão de crédito</strong> devem ser quitados
        através da fatura. O status desta transação é vinculado à quitação da
        fatura e não pode ser alterado manualmente.
      </span>
    </span>
  ) : isPago ? (
    <span>
      Essa ação irá marcar a transação como <strong>pendente</strong>.
    </span>
  ) : (
    <span>
      Essa ação irá marcar a transação como <strong>paga</strong>.
    </span>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
          className={`cursor-pointer hover:underline ${
            isPago ? "text-emerald-700" : "text-orange-500"
          }`}
        >
          {labelStatus}
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogMessage}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row gap-2">
          {isCartaoCredito ? (
            <>
              <Button variant="secondary" className="w-1/2" asChild>
                <Link
                  href={`/cartao/${cartaoId}/?periodo=${periodo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ir para fatura do cartão"
                >
                  Ver fatura do cartão
                </Link>
              </Button>

              <DialogClose asChild>
                <Button className="w-1/2" variant="default">
                  Entendi
                </Button>
              </DialogClose>
            </>
          ) : (
            <>
              <DialogClose className="w-1/2" asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <form onSubmit={handleToggle} className="w-1/2">
                <Button
                  variant={isPago ? "destructive" : "default"}
                  className="w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Atualizando..."
                    : isPago
                      ? "Sim, marcar como pendente"
                      : "Sim, marcar como pago"}
                </Button>
              </form>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
