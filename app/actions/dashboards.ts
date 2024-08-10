"use server";

import { createClient } from "@/utils/supabase/server";

// Busca a receita total do mês
export async function getIncome(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .neq("categoria", "Saldo Anterior")
    .eq("responsavel", "Você");

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const income = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return income;
}

// Busca a despesa total do mês
export async function getExpense(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você");

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const expense = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return expense;
}

// Busca o saldo anterior
export async function getLastPrevious(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .eq("categoria", "Saldo Anterior");

  if (error) {
    console.error("Erro ao buscar saldo anterior:", error);
    return null;
  }

  const lastPrevious = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return lastPrevious;
}

// Busca o valor total das despesas dos boletos
export async function getExpenseBill(month) {
  const supabase = createClient();

  const { data, error } = await supabase.from("boletos").select("valor").eq("periodo", month).eq("responsavel", "Você");

  if (error) {
    console.error("Erro ao buscar despesas de boletos:", error);
    return null;
  }

  const expenseBills = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return expenseBills;
}

// Busca o valor total das despesas pagas que não são cartao de credito.
export async function getExpensePaid(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .neq("forma_pagamento", "Cartão de Crédito")
    .eq("periodo", month)
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const totalExpensePaid = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
  return totalExpensePaid;
}

// Busca o valor total das boletos pagos no mês
export async function getExpenseBillPaid(month) {
  const supabase = createClient();

  const { data, error } = await supabase.from("boletos").select("valor").eq("periodo", month).eq("status_pagamento", "Pago");

  if (error) {
    console.error("Erro ao buscar boletos pagos:", error);
    return null;
  }

  const expensebillsPaid = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return expensebillsPaid;
}

// Busca o valor total das faturas
export async function getInvoiceList(month) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("getinvoicelists", { month });

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}
