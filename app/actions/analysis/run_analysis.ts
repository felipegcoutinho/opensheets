"use server";

import type { Analysis } from "@/components/analysis/analysis";
import { hashPayload } from "@/lib/hash";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const InputSchema = z.object({
  month: z
    .string()
    .min(3)
    .max(32)
    .transform((value) => value.trim().toLowerCase()),
  fingerprint: z.string().optional(),
});

const AnalysisSchema = z.object({
  comportamentos_observados: z.array(z.string()).default([]),
  gatilhos_de_consumo: z.array(z.string()).default([]),
  recomendações_práticas: z.array(z.string()).default([]),
  melhorias_sugeridas: z.array(z.string()).default([]),
});

const analysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comportamentos_observados: {
      type: "array",
      items: { type: "string" },
    },
    gatilhos_de_consumo: {
      type: "array",
      items: { type: "string" },
    },
    recomendações_práticas: {
      type: "array",
      items: { type: "string" },
    },
    melhorias_sugeridas: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "comportamentos_observados",
    "gatilhos_de_consumo",
    "recomendações_práticas",
    "melhorias_sugeridas",
  ],
} as const;

type Snapshot = ReturnType<typeof buildSnapshot>;

function toNumber(value: unknown) {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : 0;
}

function normalizeLabel(value: unknown, fallback: string) {
  const str = String(value ?? "");
  const trimmed = str.trim();
  if (!trimmed) return fallback;
  return trimmed.replace(/[<>]/g, "").slice(0, 80);
}

function pushAggregate(
  map: Map<string, { total: number; count: number }>,
  key: string,
  amount: number,
) {
  const item = map.get(key) ?? { total: 0, count: 0 };
  item.total += amount;
  item.count += 1;
  map.set(key, item);
}

function buildSnapshot(transactions: any[], cards: any[], month: string) {
  const incomes: number[] = [];
  const expenses: number[] = [];

  let paidExpenseTotal = 0;
  let pendingExpenseTotal = 0;
  let paidExpenseCount = 0;
  let pendingExpenseCount = 0;

  const categories = new Map<string, { total: number; count: number }>();
  const paymentMethods = new Map<string, { total: number; count: number }>();
  const conditions = new Map<string, { total: number; count: number }>();

  let maxExpenseValue = 0;
  let maxExpenseCategory = "";

  const expenseDays = new Set<string>();

  for (const row of transactions) {
    const tipo = normalizeLabel(
      row?.tipo_transacao,
      "indefinido",
    ).toLowerCase();
    const amount = toNumber(row?.valor);
    const category = normalizeLabel(row?.categoria?.nome, "sem categoria");
    const payment = normalizeLabel(row?.forma_pagamento, "outros");
    const condition = normalizeLabel(row?.condicao, "não informado");
    const realized = Boolean(row?.realizado);
    const date = row?.data_compra ? new Date(row.data_compra) : null;

    if (tipo === "receita") {
      incomes.push(amount);
    } else if (tipo === "despesa") {
      if (date && !Number.isNaN(date.valueOf())) {
        expenseDays.add(date.toISOString().slice(0, 10));
      }
      expenses.push(amount);
      pushAggregate(categories, category, amount);
      pushAggregate(paymentMethods, payment, amount);
      pushAggregate(conditions, condition, amount);

      if (realized) {
        paidExpenseTotal += amount;
        paidExpenseCount += 1;
      } else {
        pendingExpenseTotal += amount;
        pendingExpenseCount += 1;
      }

      if (amount > maxExpenseValue) {
        maxExpenseValue = amount;
        maxExpenseCategory = category;
      }
    }
  }

  const totalIncome = incomes.reduce((sum, value) => sum + value, 0);
  const totalExpense = expenses.reduce((sum, value) => sum + value, 0);
  const balance = totalIncome - totalExpense;

  const formatList = (
    map: Map<string, { total: number; count: number }>,
    overall: number,
  ) =>
    Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        total: Number(data.total.toFixed(2)),
        count: data.count,
        percentage:
          overall > 0 ? Number(((data.total / overall) * 100).toFixed(2)) : 0,
        average:
          data.count > 0 ? Number((data.total / data.count).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

  const categoryBreakdown = formatList(categories, totalExpense);
  const paymentBreakdown = formatList(paymentMethods, totalExpense);
  const conditionBreakdown = formatList(conditions, totalExpense);

  const activeCards = cards.filter(
    (card) => normalizeLabel(card?.status, "ativo").toLowerCase() === "ativo",
  );
  const totalCreditLimit = activeCards.reduce(
    (sum, card) => sum + toNumber(card?.limite),
    0,
  );

  return {
    month,
    totals: {
      income: Number(totalIncome.toFixed(2)),
      expenses: Number(totalExpense.toFixed(2)),
      balance: Number(balance.toFixed(2)),
      paidExpenses: Number(paidExpenseTotal.toFixed(2)),
      pendingExpenses: Number(pendingExpenseTotal.toFixed(2)),
    },
    counts: {
      incomes: incomes.length,
      expenses: expenses.length,
      paidExpenses: paidExpenseCount,
      pendingExpenses: pendingExpenseCount,
      activeCards: activeCards.length,
      expenseDays: expenseDays.size,
    },
    averages: {
      income:
        incomes.length > 0
          ? Number((totalIncome / incomes.length).toFixed(2))
          : 0,
      expense:
        expenses.length > 0
          ? Number((totalExpense / expenses.length).toFixed(2))
          : 0,
    },
    ratios: {
      paidExpenseRate:
        totalExpense > 0
          ? Number(((paidExpenseTotal / totalExpense) * 100).toFixed(2))
          : 0,
      creditUsage:
        totalCreditLimit > 0
          ? Number(((pendingExpenseTotal / totalCreditLimit) * 100).toFixed(2))
          : 0,
    },
    categoryBreakdown,
    paymentBreakdown,
    conditionBreakdown,
    highlights: {
      maxExpenseValue: Number(maxExpenseValue.toFixed(2)),
      maxExpenseCategory: maxExpenseCategory,
    },
    credit: {
      activeCards: activeCards.length,
      totalLimit: Number(totalCreditLimit.toFixed(2)),
    },
  } as const;
}

type AnalysisResult =
  | { status: "ok"; analysis: Analysis; fingerprint: string }
  | { status: "unchanged"; fingerprint: string }
  | { status: "error"; message: string };

const OPENROUTER_API_URL =
  process.env.OPENROUTER_API_URL ?? "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/auto";

async function requestAnalysisFromOpenRouter(snapshot: Snapshot) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY não configurada. Defina a variável no ambiente do servidor.",
    );
  }

  const systemPrompt = `
Especialista em comportamento financeiro. Forneça recomendações objetivas baseadas em métricas agregadas. Destaque padrões, riscos e oportunidades sem expor dados pessoais. Após cada recomendação, valide sucintamente se a análise atende aos critérios de objetividade e privacidade antes de prosseguir, mas não precisa exibir se está ok ou não. Adote uma abordagem pragmática e direta, utilizando verbos de ação, mas sem linguajar muito rebuscado, simplifique a comunicação. Responda exclusivamente com um JSON válido que siga exatamente o esquema especificado.`.trim();

  const userPayload = {
    referencia: snapshot.month,
    totais: snapshot.totals,
    contagens: snapshot.counts,
    medias: snapshot.averages,
    proporcoes: snapshot.ratios,
    categorias: snapshot.categoryBreakdown,
    pagamentos: snapshot.paymentBreakdown,
    condicoes: snapshot.conditionBreakdown,
    credito: snapshot.credit,
    destaques: snapshot.highlights,
  } satisfies Record<string, unknown>;

  const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer":
        process.env.OPENROUTER_REFERER ?? "https://opensheets.app",
      "X-Title": process.env.OPENROUTER_TITLE ?? "OpenSheets",
    },

    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.5,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "consumption_analysis",
          schema: analysisJsonSchema,
          strict: true,
        },
      },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analise o snapshot financeiro abaixo e devolva um JSON que respeite exatamente o esquema fornecido. Dados de entrada: ${JSON.stringify(userPayload)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    throw new Error(
      `Falha ao consultar a OpenRouter (${response.status}): ${errorPayload}`,
    );
  }

  const result = await response.json();
  const rawContent = result?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("A OpenRouter não retornou conteúdo utilizável.");
  }

  const contentText = Array.isArray(rawContent)
    ? rawContent
        .map((part: { type?: string; text?: string; content?: string }) =>
          typeof part === "string" ? part : (part?.text ?? part?.content ?? ""),
        )
        .join("")
    : String(rawContent);

  const normalized = contentText.trim();
  const jsonStart = normalized.indexOf("{");
  const jsonEnd = normalized.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("Não foi possível localizar um JSON válido na resposta.");
  }

  const parsed = JSON.parse(normalized.slice(jsonStart, jsonEnd + 1));
  const analysis = AnalysisSchema.parse(parsed) as Analysis;

  return analysis;
}

export async function runConsumptionAnalysis(
  payload: z.input<typeof InputSchema>,
): Promise<AnalysisResult> {
  const input = InputSchema.parse(payload);

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Erro ao recuperar usuário:", authError);
    return { status: "error", message: "Não foi possível validar sua sessão." };
  }

  if (!user) {
    return { status: "error", message: "É necessário estar autenticado." };
  }

  const [
    { data: transactions, error: txError },
    { data: cards, error: cardError },
  ] = await Promise.all([
    supabase
      .from("lancamentos")
      .select(
        `valor, tipo_transacao, condicao, forma_pagamento, realizado, data_compra, categoria:categoria_id(nome), pagadores!inner(role)`,
      )
      .eq("periodo", input.month)
      .eq("pagadores.role", "principal"),
    supabase.from("cartoes").select("status, limite"),
  ]);

  if (txError) {
    console.error("Erro ao buscar lançamentos:", txError);
    return {
      status: "error",
      message: "Não foi possível carregar os lançamentos.",
    };
  }

  if (cardError) {
    console.error("Erro ao buscar cartões:", cardError);
    return {
      status: "error",
      message: "Não foi possível carregar os cartões.",
    };
  }

  const snapshot = buildSnapshot(transactions ?? [], cards ?? [], input.month);
  const fingerprint = hashPayload(snapshot);

  if (input.fingerprint && input.fingerprint === fingerprint) {
    return { status: "unchanged", fingerprint };
  }

  try {
    const analysis = await requestAnalysisFromOpenRouter(snapshot);
    return { status: "ok", analysis, fingerprint };
  } catch (error) {
    console.error("Erro ao gerar análise:", error);
    return {
      status: "error",
      message: error.message || "Erro desconhecido ao gerar análise.",
    };
  }
}
