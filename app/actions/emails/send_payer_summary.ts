"use server";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import { createClient } from "@/utils/supabase/server";
// Evitar react-dom/server em Server Actions (Edge/compat). Geramos HTML manualmente.

type ActionState = {
  ok: boolean;
  message: string;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export async function sendPayerMonthlySummary(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return {
      ok: false,
      message: "RESEND_API_KEY não configurada no ambiente.",
    };
  }

  const supabase = createClient();

  const id = String(formData.get("payerId") || "");
  const month = String(formData.get("month") || "");

  if (!id || !month) {
    return { ok: false, message: "Parâmetros inválidos para envio." };
  }

  const { data: payer, error: payerError } = await supabase
    .from("pagadores")
    .select("id, nome, email")
    .eq("id", id)
    .single();

  if (payerError || !payer) {
    return { ok: false, message: "Pagador não encontrado." };
  }

  if (!payer.email) {
    return { ok: false, message: "Pagador não possui e-mail cadastrado." };
  }

  const transactions = await getTransactionsByPayer(month, id);

  // Totais simples
  const total = (transactions || []).reduce(
    (sum, t: any) => sum + (parseFloat(t.valor) || 0),
    0,
  );

  // Gera HTML do e-mail (invoice-like) manualmente
  const rows = (transactions || [])
    .map((t: any) => {
      const data = t?.data_compra || "";
      const [y, m, d] = String(data).split("-");
      const dateBr = y && m && d ? `${d}/${m}/${y}` : "—";
      const via =
        (t?.cartoes?.descricao && `Cartão: ${t.cartoes.descricao}`) ||
        (t?.contas?.descricao && `Conta: ${t.contas.descricao}`) ||
        t?.forma_pagamento ||
        "—";
      const categoria = t?.categorias?.nome || "—";
      const descricao = t?.descricao || "—";
      const valor = formatBRL(parseFloat(t?.valor) || 0);
      return `
        <tr>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px 8px;">${dateBr}</td>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px 8px;">${escapeHtml(descricao)}</td>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px 8px;">${escapeHtml(categoria)}</td>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px 8px;">${escapeHtml(via)}</td>
          <td style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;">${valor}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
  <html>
    <body style="font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;font-size:14px;color:#111827;background:#f8fafc;margin:0;padding:0;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);max-width:720px;margin:24px auto;">
        <div style="padding:16px 20px;border-bottom:1px solid #eee;background:#111827;color:#fff;">
          <h2 style="margin:0;">Resumo do mês — ${escapeHtml(month)}</h2>
          <div style="opacity:.9;">Pagador: ${escapeHtml(payer?.nome || "—")}</div>
        </div>
        <div style="padding:16px 20px;">
          <div style="font-size:16px;font-weight:600;margin-bottom:6px;">Total</div>
          <div style="font-size:24px;font-weight:700;">${formatBRL(total)}</div>
        </div>
        <div style="padding:16px 20px;">
          <div style="font-size:16px;font-weight:600;">Lançamentos</div>
          ${
            rows
              ? `
          <table style="width:100%;border-collapse:collapse;margin-top:8px;">
            <thead>
              <tr>
                <th style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;">Data</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;">Descrição</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;">Categoria</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;">Pagamento</th>
                <th style="border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;">Valor</th>
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
          `
              : `<p style="color:#6b7280;margin-top:8px;">Nenhum lançamento no período.</p>`
          }
        </div>
        <div style="padding:16px 20px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
          Este é um resumo automático. Por favor, revise os valores antes de efetuar pagamentos.
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
        to: [payer.email],
        subject: `Resumo de ${month} - ${payer.nome}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, message: `Falha ao enviar e-mail: ${err}` };
    }
  } catch (e: any) {
    return {
      ok: false,
      message: `Erro no envio: ${e?.message || "desconhecido"}`,
    };
  }

  return { ok: true, message: "E-mail enviado com sucesso." };
}

// Pequena utilidade para evitar HTML injection em campos textuais
function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
