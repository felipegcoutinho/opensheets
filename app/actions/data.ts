// src/lib/data.js

import { createClient } from "@/utils/supabase/server";

export async function fetchTransactionsData(month) {
  try {
    const [
      receitas,
      despesas,
      lastPrevious,
      expenseBill,
      expensePaid,
      expenseBillPaid,
      invoiceList,
      conditions,
      payment,
      transactionsStats,
      billsStats,
      cardsStats,
      accountsStats,
      notesStats,
      billsByResponsavel,
      expenseByCategory,
      incomeByCategory,
      recentTransactions,
    ] = await Promise.all([
      getIncome(month),
      getExpense(month),
      getLastPrevious(month),
      getExpenseBill(month),
      getExpensePaid(month),
      getExpenseBillPaid(month),
      getInvoiceList(month),
      getConditions(month),
      getPayment(month),
      getTransactionsStats(month),
      getBillsStats(month),
      getCardsStats(month),
      getAccountsStats(month),
      getNotesStats(month),
      getBillsByResponsavel(month),
      getExpenseByCategory(month),
      getIncomeByCategory(month),
      getRecentTransactions(month),
    ]);

    return {
      receitas,
      despesas,
      lastPrevious,
      expenseBill,
      expensePaid,
      expenseBillPaid,
      invoiceList,
      conditions,
      payment,
      transactionsStats,
      billsStats,
      cardsStats,
      accountsStats,
      notesStats,
      billsByResponsavel,
      expenseByCategory,
      incomeByCategory,
      recentTransactions,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Funções individuais
async function getIncome(month) {
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

async function getExpense(month) {
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

async function getLastPrevious(month) {
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

async function getExpenseBill(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("responsavel", "Você");

  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

async function getExpensePaid(month) {
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

async function getExpenseBillPaid(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("status_pagamento", "Pago");

  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

async function getInvoiceList(month) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("getinvoicelists", { month });
  if (error) throw error;
  return data;
}

async function getConditions(month) {
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

async function getPayment(month) {
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

async function getTransactionsStats(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transacoes")
    .select("count()")
    .eq("periodo", month)
    .eq("responsavel", "Você");

  if (error) throw error;
  return data;
}

async function getBillsStats(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select("count()")
    .eq("periodo", month)
    .eq("responsavel", "Você");

  if (error) throw error;
  return data;
}

async function getCardsStats() {
  const supabase = createClient();

  const { data, error } = await supabase.from("cartoes").select("count()");
  if (error) throw error;
  return data;
}

async function getAccountsStats() {
  const supabase = createClient();

  const { data, error } = await supabase.from("contas").select("count()");
  if (error) throw error;
  return data;
}

async function getNotesStats(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("anotacoes")
    .select("count()")
    .eq("periodo", month);

  if (error) throw error;
  return data;
}

async function getBillsByResponsavel(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id, descricao, periodo, dt_vencimento, categoria, status_pagamento, valor, condicao,
      qtde_recorrencia, anotacao, responsavel, contas ( id, descricao)`,
    )
    .eq("periodo", month)
    .eq("responsavel", "Você");

  if (error) throw error;
  return data;
}

async function getExpenseByCategory(month) {
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

async function getIncomeByCategory(month) {
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

async function getRecentTransactions(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, descricao, valor, cartoes (id, logo_image), contas (id, logo_image)`,
    )
    .order("created_at", { ascending: false })
    .eq("responsavel", "Você")
    .eq("periodo", month)
    .limit(5);

  if (error) throw error;
  return data;
}

// Exportações individuais para uso específico
export {
  getAccountsStats,
  getBillsByResponsavel,
  getBillsStats,
  getCardsStats,
  getConditions,
  getExpense,
  getExpenseBill,
  getExpenseBillPaid,
  getExpenseByCategory,
  getExpensePaid,
  getIncome,
  getIncomeByCategory,
  getInvoiceList,
  getLastPrevious,
  getNotesStats,
  getPayment,
  getRecentTransactions,
  getTransactionsStats,
};
