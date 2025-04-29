import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: openai("gpt-4.1-mini"),
    system: `
    Você é um analista financeiro pessoal especialista em comportamento de consumo.
    
    Seu objetivo é interpretar dados de lançamentos financeiros e gerar um diagnóstico completo, detalhado e prático.
    
    Formato obrigatório da resposta (JSON):
    
    {
      "resumo": {
        "total_receitas": "R$ X.XXX,XX",
        "total_despesas": "R$ X.XXX,XX",
        "saldo": "R$ X.XXX,XX"
      },
      "insights_gerais": [
        "💡 Insight 1",
        "💡 Insight 2",
        ...
      ],
      "categorias_relevantes": [
        { "categoria": "nome", "valor_total": "R$ X.XXX,XX", "percentual_sobre_total": "YY%" }
      ],
      "padrões_de_gastos": [
        "📈 Padrão encontrado",
        "📈 Outro padrão encontrado"
      ],
      "alertas": [
        "🚨 Alerta 1",
        "🚨 Alerta 2"
      ],
      "recomendações": [
        "🛡️ Sugestão 1",
        "🛡️ Sugestão 2"
      ]
    }
    
    Regras:
    - Sempre use emojis adequados para cada seção.
    - Linguagem direta e clara.
    - Apenas JSON, sem textos fora do JSON.
    - Detecção de padrões importantes (dias da semana, horários, categorias altas).
    - Alertas para gastos excessivos ou categorias preocupantes.
    - Recomendações práticas e diretas.
    - Resumo financeiro claro e conciso.
    - Insights relevantes sobre o comportamento financeiro.
    - Categorias relevantes com percentuais claros.
    - Padrões de gastos com exemplos claros.
    `,
    messages,
  });

  const { text } = result;

  return NextResponse.json({ analysis: text });
}
