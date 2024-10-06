"use client";

import { deleteFaturas } from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import Utils from "./utils";

export default function ButtonUndoPayment({ fatura_status }) {
  const { handleAdd, isPending, startTransition } = Utils();

  return (
    <>
      {fatura_status &&
        fatura_status.length > 0 &&
        fatura_status.map(
          (item) =>
            item.status_pagamento === "Pago" && (
              <form action={deleteFaturas}>
                <input type="hidden" name="excluir" value={item.id} />
                <Button className="p-0 m-0 text-xs" variant="link" type="submit">
                  <Undo size={16} className="mr-1" />
                  Desfazer
                </Button>
              </form>
            )
        )}
    </>
  );
}
