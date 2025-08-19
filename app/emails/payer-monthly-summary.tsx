import * as React from "react";

type Tx = {
  id: string;
  descricao?: string | null;
  data_compra?: string | null;
  forma_pagamento?: string | null;
  valor: string | number;
  cartoes?: { descricao?: string | null } | null;
  contas?: { descricao?: string | null } | null;
  categorias?: { nome?: string | null } | null;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  // datas vêm no formato YYYY-MM-DD
  try {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    const date = new Date(y, (m - 1) || 0, d || 1);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  } catch {
    return iso;
  }
}

export default function PayerMonthlySummaryEmail({
  month,
  payer,
  transactions,
  totalFormatted,
}: {
  month: string;
  payer: { id: string; nome?: string | null; email?: string | null };
  transactions: Tx[];
  totalFormatted: string;
}) {
  const headerStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid #eee",
    background: "#111827",
    color: "#fff",
  };
  const container: React.CSSProperties = {
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    fontSize: 14,
    color: "#111827",
    background: "#f8fafc",
    padding: 0,
    margin: 0,
  };
  const card: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    maxWidth: 720,
    margin: "24px auto",
  };
  const section: React.CSSProperties = { padding: "16px 20px" };
  const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 8,
  };
  const thtd: React.CSSProperties = {
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 8px",
    textAlign: "left",
  };

  const total = transactions.reduce((s, t) => s + (parseFloat(String(t.valor)) || 0), 0);

  return (
    <html>
      <body style={container}>
        <div style={card}>
          <div style={headerStyle}>
            <h2 style={{ margin: 0 }}>Resumo do mês — {month}</h2>
            <div style={{ opacity: 0.9 }}>Pagador: {payer?.nome || "—"}</div>
          </div>

          <div style={section}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Total</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{totalFormatted}</div>
          </div>

          <div style={section}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Lançamentos</div>
            {transactions.length === 0 ? (
              <p style={{ color: "#6b7280", marginTop: 8 }}>Nenhum lançamento no período.</p>
            ) : (
              <table style={table}>
                <thead>
                  <tr>
                    <th style={thtd}>Data</th>
                    <th style={thtd}>Descrição</th>
                    <th style={thtd}>Categoria</th>
                    <th style={thtd}>Pagamento</th>
                    <th style={{ ...thtd, textAlign: "right" }}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => {
                    const valorNum = parseFloat(String(t.valor)) || 0;
                    const forma = (t.forma_pagamento || "").toString();
                    const via =
                      (t.cartoes?.descricao && `Cartão: ${t.cartoes.descricao}`) ||
                      (t.contas?.descricao && `Conta: ${t.contas.descricao}`) ||
                      "";
                    return (
                      <tr key={t.id}>
                        <td style={thtd}>{formatDate(t.data_compra)}</td>
                        <td style={thtd}>{t.descricao || "—"}</td>
                        <td style={thtd}>{t.categorias?.nome || "—"}</td>
                        <td style={thtd}>{via || forma || "—"}</td>
                        <td style={{ ...thtd, textAlign: "right" }}>{formatBRL(valorNum)}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={4} style={{ ...thtd, fontWeight: 700, textAlign: "right" }}>
                      Total
                    </td>
                    <td style={{ ...thtd, fontWeight: 700, textAlign: "right" }}>{formatBRL(total)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div style={{ ...section, borderTop: "1px solid #e5e7eb", color: "#6b7280" }}>
            <div style={{ fontSize: 12 }}>Este é um resumo automático. Por favor, revise os valores antes de efetuar pagamentos.</div>
          </div>
        </div>
      </body>
    </html>
  );
}

