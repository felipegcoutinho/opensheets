"use server";

import { getEmail } from "@/app/actions/users/fetch_users";

export type ActionState = { ok: boolean; message: string };

function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendFeedback(_: ActionState, formData: FormData): Promise<ActionState> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return { ok: false, message: "RESEND_API_KEY não configurada no ambiente." };
  }

  const rawMessage = String(formData.get("message") || "").trim();
  if (!rawMessage || rawMessage.length < 5) {
    return { ok: false, message: "Por favor, descreva seu feedback (mín. 5 caracteres)." };
  }

  const userEmail = (await getEmail()) || "(usuário sem e-mail)";

  const html = `
    <html>
      <body style="font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;font-size:14px;color:#111827;background:#ffffff;">
        <div style="max-width:760px;margin:24px auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="padding:14px 18px;border-bottom:1px solid #e5e7eb;background:#111827;color:#fff;">
            <h2 style="margin:0;">Novo Feedback — OpenSheets</h2>
          </div>
          <div style="padding:14px 18px;">
            <p style="margin:0 0 8px 0;color:#6b7280;">Enviado por: <strong style="color:#111827;">${escapeHtml(userEmail)}</strong></p>
            <div style="white-space:pre-wrap;line-height:1.5;">${escapeHtml(rawMessage)}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "OpenSheets <mail@mail.felipecoutinho.com>",
        to: ["coutinho@outlook.com"],
        subject: "Feedback do usuário — OpenSheets",
        html,
        reply_to: userEmail && userEmail.includes("@") ? userEmail : undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, message: `Falha ao enviar e-mail: ${err}` };
    }
  } catch (e: any) {
    return { ok: false, message: e?.message || "Erro desconhecido" };
  }

  return { ok: true, message: "Feedback enviado com sucesso. Obrigado!" };
}
