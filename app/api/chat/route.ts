import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

// ---- Schemas ----------------------------------------------------------------

const AnalysisSchema = z.object({
  comportamentos_observados: z.array(z.string()).default([]),
  gatilhos_de_consumo: z.array(z.string()).default([]),
  recomendações_práticas: z.array(z.string()).default([]),
  melhorias_sugeridas: z.array(z.string()).default([]),
});

const MessageSchema = z.object({
  role: z.literal("user").default("user"),
  content: z.string().min(0).max(200_000),
});

const PayloadSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(10),
});

const Env = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

// ---- Utils ------------------------------------------------------------------

const sanitize = (str: string) => String(str).replace(/[<>]/g, "");

function isJsonContentType(req: Request) {
  const ct = req.headers.get("content-type") || "";
  return ct.toLowerCase().startsWith("application/json");
}

function isAllowedOrigin(req: Request, siteUrl?: string) {
  if (!siteUrl) return true;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(siteUrl).host;
  } catch {
    return false;
  }
}

// Fallback: tenta achar o primeiro objeto JSON no texto
function parseFirstJsonObject<T>(text: string): T | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

// ---- Handler ----------------------------------------------------------------

export async function POST(req: Request) {
  if (!isJsonContentType(req)) {
    return NextResponse.json(
      { error: "Invalid content-type" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PayloadSchema.safeParse({
    messages: Array.isArray((body as any)?.messages)
      ? (body as any).messages.slice(0, 10).map((m: any) => ({
          role: "user",
          content: sanitize(m?.content ?? ""),
        }))
      : [],
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { NEXT_PUBLIC_SITE_URL } = Env.parse(process.env);
  if (!isAllowedOrigin(req, NEXT_PUBLIC_SITE_URL)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // 🔒 Saída estruturada e validada no próprio provider
    const result = await generateObject({
      model: openai("gpt-5"),
      schema: AnalysisSchema,
      system: `
        Você é um analista financeiro pessoal especializado em comportamento de consumo.

        Seu papel é interpretar hábitos de consumo com base em transações financeiras. Não forneça resumo numérico. Em vez disso, foque em:

        1. Detecção de comportamentos de consumo recorrentes.
        2. Identificação de gatilhos de compra e padrões emocionais.
        3. Recomendações práticas para melhorar o controle de gastos e estimular hábitos financeiros saudáveis.
        4. Sugestões de pequenas mudanças com alto impacto.
        5. Sinais de consumo impulsivo ou desorganizado.
        6. Áreas com potencial de economia imediata ou reestruturação.

        Responda exclusivamente em JSON com o seguinte formato:
  
      {
        "comportamentos_observados": [
          "Hábito ou padrão identificado...",
          ...
        ],
        "gatilhos_de_consumo": [
          "Gatilho emocional ou padrão de comportamento...",
          ...
        ],
        "recomendações_práticas": [
          "Ação prática e direta...",
          ...
        ],
        "melhorias_sugeridas": [
          "Mudança comportamental com impacto positivo...",
          ...
        ]
      }

        Regras:
        - Sempre use linguagem clara, direta e interpretativa.
        - Não repetir dados, gerar análise baseada em comportamento.
        - Traga ao menos 2 observações por seção sempre que possível.
        - Evite jargões financeiros complexos.
        - Foque em ações práticas e sugestões de melhoria.
        - Não faça suposições sobre a situação financeira do usuário.
        - Não inclua informações pessoais ou sensíveis.
        - Seja crítico e duro, mas construtivo.
      `.trim(),
      messages: parsed.data.messages,
      // parâmetros opcionais para estabilidade
      temperature: 0.3,
      maxTokens: 700,
    });

    // Caminho feliz: objeto já validado
    const analysis = result.object;
    return NextResponse.json({ analysis });
  } catch (e: any) {
    // Fallback defensivo: alguns providers/versões podem retornar texto
    const text: string | undefined = e?.data?.text ?? e?.text ?? undefined;

    if (typeof text === "string") {
      const obj = parseFirstJsonObject<unknown>(text);
      if (obj) {
        const check = AnalysisSchema.safeParse(obj);
        if (check.success) {
          return NextResponse.json({ analysis: check.data });
        }
      }
    }

    console.error("LLM error:", e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
