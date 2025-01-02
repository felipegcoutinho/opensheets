"use client";

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
import { useTransition } from "react";
import { payBills } from "../app/actions/bills";

export default function PayBills({ id, descricao, valor }) {
  const [isPending, startTransition] = useTransition();

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.target);
      payBills(formData, id);
    });
  };

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

          <form className="w-1/2" onSubmit={handleAdd}>
            <Button
              className={`w-full bg-green-500 hover:bg-green-600 ${isPending ? "opacity-50" : ""}`}
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
