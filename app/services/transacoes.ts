// /services/transacoes.ts
import { createClient } from "@/utils/supabase/server";

export async function getIncome(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .neq("categoria", "Saldo Anterior")
    .eq("responsavel", "Você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpense(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getLastPrevious(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .eq("categoria", "Saldo Anterior");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpensePaid(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .neq("forma_pagamento", "Cartão de Crédito")
    .eq("periodo", month)
    .eq("realizado", true);
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getConditions(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("condicao, valor.sum()")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("condicao", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPayment(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("forma_pagamento, valor.sum()")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("forma_pagamento", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTransactionsStats(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("count()")
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data;
}

export async function getExpenseByCategory(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("categoria, tipo_transacao, valor.sum()")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("categoria", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getIncomeByCategory(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("categoria, tipo_transacao, valor.sum()")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .order("categoria", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getRecentTransactions(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      "id, data_compra, descricao, valor, cartoes (id, logo_image), contas (id, logo_image)",
    )
    .order("created_at", { ascending: false })
    .eq("responsavel", "Você")
    .eq("periodo", month)
    .limit(5);
  if (error) throw error;
  return data;
}

export async function getSumAccountExpensePaid(month) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .eq("realizado", true)
    .eq("responsavel", "Você")
    .neq("responsavel", "Sistema");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getSumAccountIncomePaid(month) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("periodo", month)
    .eq("tipo_transacao", "Receita")
    .eq("realizado", true)
    .neq("responsavel", "Sistema");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getTransactions(month: string) {
  const supabase = await createClient();

  const { data: transacao, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria , imagem_url, realizado, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, dividir_lancamento, cartoes (id, descricao, logo_image), contas (id, descricao, logo_image)`,
    )
    .order("created_at", { ascending: false })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar Lançamentos:", error);
    return [];
  }

  return transacao;
}
