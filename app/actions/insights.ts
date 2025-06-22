"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";
import { getCards } from "@/app/services/cartoes";
import { getNewCategorias } from "@/app/services/categorias";
import { getTransactionsByResponsableVoce } from "@/app/services/transacoes";
import { createClient } from "@/utils/supabase/server";

const messagesSchema = z
  .array(
    z.object({
      role: z.literal("user"),
      content: z.string().max(10000),
    }),
  )
  .max(6);

const SYSTEM_PROMPT = `
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
    `;

export async function generateInsights(
  _prevState: unknown,
  formData: FormData,
) {
  const month = formData.get("month")?.toString() ?? "";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const [lancamentos, cartoes, categorias] = await Promise.all([
    getTransactionsByResponsableVoce(month),
    getCards(),
    getNewCategorias(),
  ]);

  const messages = [
    { role: "user", content: JSON.stringify(lancamentos) },
    { role: "user", content: JSON.stringify(cartoes) },
    { role: "user", content: JSON.stringify(categorias) },
  ];

  const validated = messagesSchema.safeParse(messages);
  if (!validated.success) {
    throw new Error("Invalid input");
  }

  const result = await generateText({
    model: openai("gpt-4.1-mini"),
    system: SYSTEM_PROMPT,
    messages: validated.data,
  });

  const { text } = result;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
