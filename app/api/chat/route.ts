import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

const sanitize = (str: string) => str.replace(/[<>]/g, "");

function validateMessages(data: unknown) {
  if (!Array.isArray(data)) return null;
  return data.slice(0, 10).map((m) => ({
    role: typeof m.role === "string" ? m.role : "user",
    content: sanitize(String(m.content ?? "")),
  }));
}

export async function POST(req: Request) {
  if (req.headers.get("content-type") !== "application/json") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  const messages = validateMessages(body?.messages);
  if (!messages) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "";
  if (origin && !origin.startsWith(process.env.NEXT_PUBLIC_SITE_URL!)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await generateText({
    model: openai("gpt-4.1-mini"),
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
          "🔍 Hábito ou padrão identificado...",
          ...
        ],
        "gatilhos_de_consumo": [
          "⚠️ Gatilho emocional ou padrão de comportamento...",
          ...
        ],
        "recomendações_práticas": [
          "✅ Ação prática e direta...",
          ...
        ],
        "melhorias_sugeridas": [
          "🚀 Mudança comportamental com impacto positivo...",
          ...
        ]
      }
  
      Regras:
      - Não inclua dados brutos ou valores em reais.
      - Sempre use linguagem clara, direta e interpretativa.
      - Emojis ajudam na leitura, use com moderação e coerência.
      - Não repetir dados, gerar análise baseada em comportamento.
      - Traga ao menos 2 observações por seção sempre que possível.
      - Evite jargões financeiros complexos.
      - Foque em ações práticas e sugestões de melhoria.
      - Não faça suposições sobre a situação financeira do usuário.
      - Não inclua informações pessoais ou sensíveis.
      - Seja crítico e duro, mas construtivo.
    `,
    messages,
  });

  const { text } = result;

  return NextResponse.json({ analysis: text });
}
