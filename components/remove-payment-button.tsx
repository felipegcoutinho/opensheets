"use client";
import { deleteFaturas } from "@/actions/invoices";
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
import Utils from "./utils";

export default function RemovePaymentButton({ fatura_status }) {
  const { handleAdd, isPending, startTransition } = Utils();

  const handleDeleteInvoice = (e, id) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target);
      deleteFaturas(formData, id);
    });
  };

  return (
    <>
      {fatura_status &&
        fatura_status.length > 0 &&
        fatura_status.map(
          (item) =>
            item.status_pagamento === "pago" && (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <span className="cursor-pointer text-red-500 hover:underline">
                    desfazer pagamento
                  </span>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Confirmar Exclusão
                    </DialogTitle>
                    <DialogDescription className="mt-0 flex flex-col py-6 text-center text-lg">
                      Tem certeza que deseja desfazer este pagamento? Esta ação
                      não poderá ser desfeita.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex w-full flex-row">
                    <DialogClose className="w-1/2" asChild>
                      <Button type="button" variant="secondary">
                        Cancelar
                      </Button>
                    </DialogClose>

                    <form
                      className="w-1/2"
                      onSubmit={(e) => handleDeleteInvoice(e, item.id)}
                    >
                      <input type="hidden" name="excluir" value={item.id} />
                      <Button
                        className={`w-full ${isPending ? "opacity-50" : ""}`}
                        type="submit"
                        variant="destructive"
                        disabled={isPending}
                      >
                        {isPending ? "Removendo..." : "Confirmar remoção"}
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ),
        )}
    </>
  );
}
