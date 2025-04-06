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
import { useState } from "react";

export default function TogglePaymentDialog({
  id,
  realizadoAtual,
  formaPagamento,
  onStatusChanged,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCartaoCredito = formaPagamento === "Cartão de Crédito";

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger hidden={isCartaoCredito} asChild>
        <span
          className={`cursor-pointer hover:underline ${
            realizadoAtual ? "text-green-500" : "text-orange-500"
          }`}
        >
          {realizadoAtual ? "Pago" : "Pagar"}
        </span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCartaoCredito
              ? "Pagamento via cartão"
              : realizadoAtual
                ? "Desfazer pagamento?"
                : "Marcar como pago?"}
          </DialogTitle>
          <DialogDescription>
            {isCartaoCredito ? (
              <>
                Para pagamentos com <strong>Cartão de Crédito</strong>, é
                necessário pagar a fatura do cartão. Você não pode alterar o
                status manualmente.
              </>
            ) : realizadoAtual ? (
              "Isso marcará a transação como pendente."
            ) : (
              "Isso marcará a transação como paga."
            )}
          </DialogDescription>
        </DialogHeader>

        {isCartaoCredito ? (
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" variant="default">
                Entendi
              </Button>
            </DialogClose>
          </DialogFooter>
        ) : (
          <DialogFooter className="flex w-full gap-2">
            <DialogClose className="w-1/2" asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <form onSubmit={handleToggle} className="w-1/2">
              <Button
                variant={realizadoAtual ? "destructive" : "default"}
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Atualizando..."
                  : realizadoAtual
                    ? "Sim, marcar como pendente"
                    : "Sim, marcar como pago"}
              </Button>
            </form>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
