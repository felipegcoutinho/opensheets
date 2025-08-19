"use server";

import { createClient } from "@/utils/supabase/server";

type Payer = {
  id: string;
  nome?: string | null;
  email?: string | null;
  is_auto_send?: boolean | null;
};

type NewTransaction = {
  data_compra: string | null;
  data_vencimento: string | null;
  descricao?: string;
  periodo: string;
  forma_pagamento?: string;
  valor: number;
  parcela_atual: number | null;
  qtde_parcela: number | null;
  dividir_lancamento: boolean;
  pagador_id?: string | null;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeFormaPagamento(s?: string | null) {
  const v = (s || "").trim().toLowerCase();
  if (["cartão de crédito", "cartao de credito", "crédito", "credito"].includes(v)) return "cartão de crédito";
  if (["cartão de débito", "cartao de debito", "débito", "debito"].includes(v)) return "cartão de débito";
  if (v === "boleto") return "boleto";
  if (v === "pix") return "pix";
  if (["dinheiro", "cash"].includes(v)) return "dinheiro";
  return v || "outro";
}

export async function sendNewTransactionsEmail(
  payer: Payer,
  transactions: NewTransaction[],
): Promise<{ ok: boolean; message: string }> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return {
      ok: false,
      message: "RESEND_API_KEY não configurada no ambiente.",
    };
  }

  if (!payer?.email) {
    return { ok: false, message: "Pagador não possui e-mail cadastrado." };
  }

  const total = (transactions || []).reduce((sum, t) => sum + (Number(t.valor) || 0), 0);

  // Quebra por forma de pagamento (cores iguais ao app)
  let cardsTotal = 0;
  let boletosTotal = 0;
  let outrosTotal = 0;
  for (const t of transactions || []) {
    const fp = normalizeFormaPagamento(t.forma_pagamento);
    const val = Number(t.valor) || 0;
    if (fp === "cartão de crédito") cardsTotal += val;
    else if (fp === "boleto") boletosTotal += val;
    else if (["pix", "dinheiro", "cartão de débito"].includes(fp)) outrosTotal += val;
  }
  const pct = (n: number) => (total > 0 ? Math.max(0, Math.min(100, (n / total) * 100)) : 0);

  const rows = (transactions || [])
    .map((t) => {
      const data = t?.data_compra || "";
      const [y, m, d] = String(data).split("-");
      const dateBr = y && m && d ? `${d}/${m}/${y}` : "—";
      const via = t?.forma_pagamento || "—";
      const descricao = t?.descricao || "—";
      const valor = formatBRL(Number(t?.valor) || 0);
      const parcela = t?.qtde_parcela && t.parcela_atual ? `${t.parcela_atual}/${t.qtde_parcela}` : "—";
      return `
        <tr>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:8px 6px;\">${dateBr}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:8px 6px;\">${escapeHtml(descricao)}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:8px 6px;\">${escapeHtml(via)}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:center;\">${parcela}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:right;\">${valor}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
  <html>
    <body style="font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;font-size:14px;color:#111827;background:#f8fafc;margin:0;padding:0;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);max-width:760px;margin:24px auto;">
        <div style="padding:14px 18px;border-bottom:1px solid #e5e7eb;background:#111827;color:#fff;">
          <h2 style="margin:0;">Novos lançamentos</h2>
          <div style="opacity:.9;">Pagador: ${escapeHtml(payer?.nome || "—")}</div>
        </div>
        <div style="padding:14px 18px;">
          <div style="font-size:16px;font-weight:600;margin-bottom:6px;">Total</div>
          <div style="font-size:22px;font-weight:700;">${formatBRL(total)}</div>
          <div style="margin-top:10px;border-radius:6px;background:#f1f5f9;height:8px;overflow:hidden;">
            <div style="display:flex;height:100%;width:100%;">
              <div style="height:100%;width:${pct(cardsTotal)}%;background:#6366f1;" title="Cartão"></div>
              <div style="height:100%;width:${pct(boletosTotal)}%;background:#f59e0b;" title="Boleto"></div>
              <div style="height:100%;width:${pct(outrosTotal)}%;background:#10b981;" title="Pix/Dinheiro/Débito"></div>
            </div>
          </div>
          <div style="color:#6b7280;display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;font-size:12px;">
            <span>Cartão: <strong style="color:#111827;">${formatBRL(cardsTotal)}</strong></span>
            <span>Boleto: <strong style="color:#111827;">${formatBRL(boletosTotal)}</strong></span>
            <span>Pix/Dinheiro/Débito: <strong style="color:#111827;">${formatBRL(outrosTotal)}</strong></span>
          </div>
        </div>
        <div style="padding:14px 18px;">
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            <thead>
              <tr>
                <th style="border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:left;">Data</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:left;">Descrição</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:left;">Pagamento</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:center;">Parcela</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:8px 6px;text-align:right;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr>
                <td colspan="4" style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;font-weight:700;">Total</td>
                <td style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;font-weight:700;">${formatBRL(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="padding:14px 18px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
          Este e-mail foi enviado automaticamente porque o envio automático está ativo para este pagador.
        </div>
      </div>
    </body>
  </html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "OpenSheets <mail@mail.felipecoutinho.com>",
        to: [payer.email!],
        subject: `Novos lançamentos - ${payer?.nome || "Pagador"}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, message: `Falha ao enviar e-mail: ${err}` };
    }
  } catch (e: any) {
    return { ok: false, message: e?.message || "Erro desconhecido" };
  }

  return { ok: true, message: "E-mail enviado com sucesso." };
}

export async function fetchPayersByIds(ids: string[]) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pagadores")
    .select("id, nome, email, is_auto_send")
    .in("id", ids);
  if (error) throw error;
  return data as Payer[];
}
