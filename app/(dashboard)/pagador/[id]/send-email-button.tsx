"use client";
import { sendPayerMonthlySummary } from "@/app/actions/emails/send_payer_summary";
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
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const initial = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enviando..." : "Enviar resumo"}
    </Button>
  );
}

type PreviewTx = {
  descricao?: string | null;
  valor?: number | string;
  data_compra?: string | null;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const [y, m, d] = String(iso).split("-");
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

export default function SendEmailButton({
  payerId,
  month,
  payerName,
  payerEmail,
  total,
  preview = [],
}: {
  payerId: string;
  month: string;
  payerName?: string | null;
  payerEmail?: string | null;
  total: number;
  preview?: PreviewTx[];
}) {
  const [state, action] = useActionState(
    sendPayerMonthlySummary as any,
    initial as any,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state?.ok]);

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="default">
            Enviar resumo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar envio</DialogTitle>
            <DialogDescription>
              Será enviado um resumo de {month} para {payerName || "—"}{" "}
              {payerEmail ? `<${payerEmail}>` : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm">
              <div>
                <span className="text-muted-foreground">Pagador:</span>{" "}
                {payerName || "—"}
              </div>

              <div>
                <span className="text-muted-foreground">E-mail:</span>{" "}
                {payerEmail || "—"}
              </div>

              <div>
                <span className="text-muted-foreground">Mês:</span> {month}
              </div>

              <div>
                <span className="text-muted-foreground">Total:</span>{" "}
                {formatBRL(total)}
              </div>
            </div>

            {preview.length > 0 ? (
              <div className="rounded-md border p-2">
                <ul className="max-h-48 space-y-1 overflow-auto text-sm">
                  {preview.slice(0, 5).map((t, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="truncate">
                        {formatDate(t.data_compra)} — {t.descricao || "—"}
                      </span>
                      <span className="shrink-0">
                        {formatBRL(parseFloat(String(t.valor || 0)) || 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Sem lançamentos para este mês.
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <form action={action} className="contents">
              <input type="hidden" name="payerId" value={payerId} />
              <input type="hidden" name="month" value={month} />
              <Submit />
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {state?.message ? (
        <span
          className={`text-xs ${state.ok ? "text-emerald-600" : "text-red-600"}`}
        >
          {state.message}
        </span>
      ) : null}
    </div>
  );
}
