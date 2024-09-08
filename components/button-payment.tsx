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
import Numbers from "./numbers";
import Utils from "./utils";

export default function ButtonPayment({ fatura_status, month, paramsId, descricao, valor }) {
  const { handleAdd, isPending, startTransition } = Utils();

  return (
    <>
      {fatura_status && fatura_status.length > 0 ? (
        fatura_status.map(
          (item) =>
            item.status_pagamento === "Pago" && (
              <Button className="h-6" variant="success" type="button">
                Pago
              </Button>
            )
        )
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-6" variant="warning" type="button">
              Pagar
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Confirmação de Pagamento</DialogTitle>
              <DialogDescription className="text-lg text-center flex flex-col py-6 mt-0">
                Você está pagando a fatura de {descricao} no valor de <Numbers number={valor} />
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="w-full flex flex-row">
              <DialogClose className="w-1/2" asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>

              <form className="w-1/2" onSubmit={handleAdd}>
                <input type="hidden" name="status_pagamento" defaultValue={"Pago"} />
                <input type="hidden" name="periodo" defaultValue={month} />
                <input type="hidden" name="cartao_id" defaultValue={paramsId} />

                <Button className={`w-full bg-green-500 hover:bg-green-600 ${isPending ? "opacity-50" : ""}`} type="submit" disabled={isPending}>
                  {isPending ? "Processando..." : "Pagar Fatura"}
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
