"use client";

import { deleteFaturas } from "@/app/actions/invoices/delete_invoices";
import { updateInvoicePaymentDate } from "@/app/actions/invoices/update_payment_date";
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
import UtilitiesComponents from "./utilities-components";
import { toast } from "sonner";
import { RiEdit2Line } from "@remixicon/react";

export default function RemovePaymentButton({
  fatura_status,
}: {
  fatura_status: {
    id: string;
    status_pagamento: string;
    created_at: string | null;
  }[];
}) {
  const { isPending, startTransition } = UtilitiesComponents();

  const handleDeleteInvoice = (e, id) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target as HTMLFormElement);
      deleteFaturas(formData).then((resp) => {
        if (resp?.success) toast.success(resp.message || "Pagamento desfeito");
        else toast.error(resp?.message || "Erro ao desfazer pagamento");
      });
    });
  };

  const handleUpdatePayment = (e) => {
    e.preventDefault();
    startTransition(() => {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      updateInvoicePaymentDate(formData).then((resp) => {
        if (resp?.success) toast.success(resp.message || "Data atualizada");
        else toast.error(resp?.message || "Falha ao atualizar data");
      });
    });
  };

  return (
    <>
      {fatura_status &&
        fatura_status.length > 0 &&
        fatura_status.map(
          (item) =>
            item.status_pagamento === "pago" && (
              <div key={item.id} className="flex items-center gap-3">
                {/* Desfazer pagamento */}
                <Dialog>
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
                        Tem certeza que deseja desfazer este pagamento? Esta
                        ação não poderá ser desfeita.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      className="flex w-full flex-row gap-2"
                      onSubmit={(e) => handleDeleteInvoice(e, item.id)}
                    >
                      <input type="hidden" name="excluir" value={item.id} />
                      <DialogFooter className="flex w-full flex-row gap-2">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            className="w-1/2"
                          >
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button
                          className={`w-1/2 ${isPending ? "opacity-50" : ""}`}
                          type="submit"
                          variant="destructive"
                          disabled={isPending}
                        >
                          {isPending ? "Removendo..." : "Confirmar remoção"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Alterar data de pagamento */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      title="Alterar data de pagamento"
                    >
                      <RiEdit2Line size={16} />
                    </button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Alterar data de pagamento
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Selecione a nova data para registrar o pagamento da
                        fatura.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleUpdatePayment}
                      className="flex flex-col gap-4"
                    >
                      <input type="hidden" name="id" defaultValue={item.id} />
                      <div>
                        <label
                          htmlFor="created_at"
                          className="mb-1 block text-sm"
                        >
                          Data do pagamento
                        </label>
                        <input
                          id="created_at"
                          name="created_at"
                          type="date"
                          defaultValue={
                            item.created_at
                              ? String(item.created_at).slice(0, 10)
                              : ""
                          }
                          className="w-full rounded border px-3 py-2"
                        />
                      </div>
                      <DialogFooter className="flex flex-row gap-2">
                        <DialogClose asChild className="w-1/2">
                          <Button type="button" variant="secondary">
                            Cancelar
                          </Button>
                        </DialogClose>

                        <DialogClose asChild className="w-1/2">
                          <Button type="submit" disabled={isPending}>
                            {isPending ? "Salvando..." : "Salvar"}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            ),
        )}
    </>
  );
}
