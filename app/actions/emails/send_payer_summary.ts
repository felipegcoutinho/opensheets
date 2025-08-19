"use server";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import { createClient } from "@/utils/supabase/server";

type ActionState = { ok: boolean; message: string };

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

function normalizeFormaPagamento(s?: string | null) {
  const v = (s || "").trim().toLowerCase();
  if (
    ["cartão de crédito", "cartao de credito", "crédito", "credito"].includes(v)
  )
    return "cartão de crédito";
  if (["cartão de débito", "cartao de debito", "débito", "debito"].includes(v))
    return "cartão de débito";
  if (v === "boleto") return "boleto";
  if (v === "pix") return "pix";
  if (["dinheiro", "cash"].includes(v)) return "dinheiro";
  return v || "outro";
}

export async function sendPayerMonthlySummary(
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY)
    return {
      ok: false,
      message: "RESEND_API_KEY não configurada no ambiente.",
    };

  const supabase = createClient();
  const id = String(formData.get("payerId") || "");
  const month = String(formData.get("month") || "");
  if (!id || !month)
    return { ok: false, message: "Parâmetros inválidos para envio." };

  const { data: payer, error: payerError } = await supabase
    .from("pagadores")
    .select("id, nome, email")
    .eq("id", id)
    .single();
  if (payerError || !payer)
    return { ok: false, message: "Pagador não encontrado." };
  if (!payer.email)
    return { ok: false, message: "Pagador não possui e-mail cadastrado." };

  const transactions = await getTransactionsByPayer(month, id);
  const list = Array.isArray(transactions) ? transactions : [];
  const total = list.reduce(
    (sum: number, t: any) => sum + (parseFloat(t.valor) || 0),
    0,
  );

  // Agregações (molde da página)
  const cardMap = new Map<
    string,
    { descricao: string; logo_image?: string | null; total: number }
  >();
  let cardsTotal = 0;
  for (const t of list) {
    if ((t?.tipo_transacao || "") !== "despesa") continue;
    if (normalizeFormaPagamento(t?.forma_pagamento) !== "cartão de crédito")
      continue;
    const desc = t?.cartoes?.descricao || "Outros Cartões";
    const totalPrev = cardMap.get(desc)?.total || 0;
    const val = parseFloat(t?.valor) || 0;
    cardMap.set(desc, {
      descricao: desc,
      logo_image: t?.cartoes?.logo_image || null,
      total: totalPrev + val,
    });
    cardsTotal += val;
  }
  const cardsSummary = Array.from(cardMap.values());

  const boletoMap = new Map<string, number>();
  let boletosTotal = 0;
  for (const t of list) {
    if ((t?.tipo_transacao || "") !== "despesa") continue;
    if (normalizeFormaPagamento(t?.forma_pagamento) !== "boleto") continue;
    const desc = t?.descricao || "Boleto";
    const val = parseFloat(t?.valor) || 0;
    boletoMap.set(desc, (boletoMap.get(desc) || 0) + val);
    boletosTotal += val;
  }
  const boletosSummary = Array.from(boletoMap.entries()).map(
    ([descricao, total]) => ({ descricao, total }),
  );

  const allowed = new Set(["pix", "dinheiro", "cartão de débito"]);
  const outrosMap = new Map<string, number>();
  let outrosTotal = 0;
  for (const t of list) {
    if ((t?.tipo_transacao || "") !== "despesa") continue;
    const forma = normalizeFormaPagamento(t?.forma_pagamento);
    if (!allowed.has(forma)) continue;
    const val = parseFloat(t?.valor) || 0;
    outrosMap.set(forma, (outrosMap.get(forma) || 0) + val);
    outrosTotal += val;
  }
  const outrosSummary = Array.from(outrosMap.entries()).map(
    ([forma, total]) => ({ forma, total }),
  );

  const pct = (n: number) =>
    total > 0 ? Math.max(0, Math.min(100, (n / total) * 100)) : 0;
  // Tabela detalhada
  const detailRows = list
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
          <td style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;\">${dateBr}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;\">${escapeHtml(descricao)}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;\">${escapeHtml(categoria)}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;\">${escapeHtml(via)}</td>
          <td style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;\">${valor}</td>
        </tr>`;
    })
    .join("");

  const html = `
  <html>
    <body style="font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;font-size:14px;color:#111827;background:#f8fafc;margin:0;padding:0;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.05);max-width:760px;margin:24px auto;">
        <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#111827;color:#fff;">
          <h2 style="margin:0;">Resumo do mês — ${escapeHtml(month)}</h2>
          <div style="opacity:.9;">Pagador: ${escapeHtml(payer?.nome || "—")}</div>
        </div>

        <div style="padding:16px 20px;">
          <div style="font-size:16px;font-weight:600;margin-bottom:6px;">Total no mês</div>
          <div style="font-size:26px;font-weight:700;">${formatBRL(total)}</div>

          <div style="margin-top:12px;border-radius:6px;background:#f1f5f9;height:8px;overflow:hidden;">
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

        <div style="padding:4px 16px 16px;display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:12px;">
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;color:#6b7280;font-size:12px;">
              <span style="display:flex;align-items:center;gap:6px;">Cartão</span>
              <span style="font-weight:600;color:#111827;">${formatBRL(cardsTotal)}</span>
            </div>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
              ${
                cardsSummary.length
                  ? cardsSummary
                      .map(
                        (c) => `
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:14px;">
                  <span style="display:flex;align-items:center;gap:8px;">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${c.logo_image ? "#6366f1" : "#e5e7eb"};"></span>
                    <span style="text-transform:capitalize;max-width:380px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(c.descricao)}</span>
                  </span>
                  <span style="font-weight:500;">${formatBRL(c.total)}</span>
                </div>`,
                      )
                      .join("")
                  : `<p style=\"color:#6b7280;font-size:14px;\">Sem despesas em cartão.</p>`
              }
            </div>
          </div>

          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;color:#6b7280;font-size:12px;">
              <span style="display:flex;align-items:center;gap:6px;">Boleto</span>
              <span style="font-weight:600;color:#111827;">${formatBRL(boletosTotal)}</span>
            </div>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
              ${
                boletosSummary.length
                  ? boletosSummary
                      .map(
                        (b) => `
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:14px;">
                  <span style="display:flex;align-items:center;gap:8px;">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:#f59e0b;"></span>
                    <span style="text-transform:capitalize;max-width:380px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(b.descricao)}</span>
                  </span>
                  <span style="font-weight:500;">${formatBRL(b.total)}</span>
                </div>`,
                      )
                      .join("")
                  : `<p style=\"color:#6b7280;font-size:14px;\">Sem boletos.</p>`
              }
            </div>
          </div>

          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;color:#6b7280;font-size:12px;">
              <span style="display:flex;align-items:center;gap:6px;">Pix/Dinheiro/Débito</span>
              <span style="font-weight:600;color:#111827;">${formatBRL(outrosTotal)}</span>
            </div>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
              ${
                outrosSummary.length
                  ? outrosSummary
                      .map(
                        (o) => `
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:14px;">
                  <span style="display:flex;align-items:center;gap:8px;">
                    <span style="display:inline-block;width:16px;height:16px;border-radius:4px;background:${o.forma === "pix" ? "#10b981" : "#e5e7eb"};"></span>
                    <span style="text-transform:capitalize;">${escapeHtml(o.forma)}</span>
                  </span>
                  <span style="font-weight:500;">${formatBRL(o.total)}</span>
                </div>`,
                      )
                      .join("")
                  : `<p style=\"color:#6b7280;font-size:14px;\">Sem movimentos.</p>`
              }
            </div>
          </div>
        </div>

        <!-- Tabela completa de lançamentos -->
        <div style=\"padding:16px 20px;\">
          <div style=\"font-size:16px;font-weight:600;\">Lançamentos</div>
          ${
            detailRows
              ? `
          <table style=\"width:100%;border-collapse:collapse;margin-top:8px;\">
            <thead>
              <tr>
                <th style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;\">Data</th>
                <th style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;\">Descrição</th>
                <th style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;\">Categoria</th>
                <th style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:left;\">Pagamento</th>
                <th style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;\">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${detailRows}
              <tr>
                <td colspan=\"4\" style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;font-weight:700;\">Total</td>
                <td style=\"border-bottom:1px solid #e5e7eb;padding:10px 8px;text-align:right;font-weight:700;\">${formatBRL(total)}</td>
              </tr>
            </tbody>
          </table>
          `
              : `<p style=\\\"color:#6b7280;margin-top:8px;\\\">Nenhum lançamento no período.</p>`
          }
        </div>

        <div style="padding:14px 18px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
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
    // Atualiza o campo last_mail após envio bem-sucedido
    try {
      // Armazena em UTC (ISO) para consistência com timestamptz
      // A formatação local é feita na camada de UI com timeZone: 'America/Sao_Paulo'
      await supabase
        .from("pagadores")
        .update({ last_mail: new Date().toISOString() })
        .eq("id", id);
    } catch (e) {
      console.error("Falha ao atualizar last_mail:", e);
    }
  } catch (e: any) {
    return {
      ok: false,
      message: `Erro no envio: ${e?.message || "desconhecido"}`,
    };
  }

  return { ok: true, message: "E-mail enviado com sucesso." };
}

function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
