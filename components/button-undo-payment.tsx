"use client";

import { Button } from "@/components/ui/button";
import { deleteFaturas } from "@actions/invoices";
import { Fragment } from "react";
import Utils from "./utils";

export default function RemovePaymentButton({ fatura_status }) {
  const { handleAdd, isPending, startTransition } = Utils();

  return (
    <Fragment>
      {fatura_status &&
        fatura_status.length > 0 &&
        fatura_status.map(
          (item) =>
            item.status_pagamento === "Pago" && (
              <form key={item.id} action={deleteFaturas}>
                <input type="hidden" name="excluir" value={item.id} />
                <Button className="h-6" variant="destructive" type="submit">
                  Remover Pagamento
                </Button>
              </form>
            ),
        )}
    </Fragment>
  );
}
