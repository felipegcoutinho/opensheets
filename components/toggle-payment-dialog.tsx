"use client";

import { togglePagamento } from "@/app/actions/transactions";
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
import Link from "next/link";
import { useState } from "react";

export default function TogglePaymentDialog({
  id,
  realizadoAtual,
  periodo,
  formaPagamento,
  onStatusChanged,
  cartaoId,
  cartoDescricao,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCartaoCredito = formaPagamento === "cartão de crédito";
  const cartoDescricaoLowerCase = cartoDescricao?.toLowerCase();
  const isPago = realizadoAtual;

  const handleToggle = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await togglePagamento(id, realizadoAtual);

    if (!error) {
      onStatusChanged(!realizadoAtual);
      setOpen(false);
    }

    setLoading(false);
  };

  const labelStatus = isPago ? "Pago" : "Pagar";
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
            isPago ? "text-green-500" : "text-orange-500"
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
              <Button variant={"outline"} className="w-1/2" asChild>
                <Link
                  href={`/cartao/${cartaoId}/${cartoDescricaoLowerCase}?periodo=${periodo}`}
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
