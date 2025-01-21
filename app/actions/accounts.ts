"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Busca a lista de contas bancárias salvas
export async function getAccount() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contas")
    .select(`id, descricao, status, tipo_conta, logo_image, anotacao`);

  if (error) {
    console.error("Erro ao buscar contas:", error);
    return null;
  }

  return data;
}

// Busca detalhes de uma conta bancária específica
export async function getAccountDetails(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contas")
    .select(`id, descricao, status, tipo_conta, logo_image, anotacao`)
    .eq("id", id);

  if (error) {
    console.error("Erro ao buscar detalhes das contas:", error);
    return null;
  }

  return data;
}

// Adiciona uma nova conta bancária
export async function addAccount(formData: FormData) {
  const { descricao, status, tipo_conta, logo_image, anotacao } =
    Object.fromEntries(formData.entries());

  const supabase = await createClient();

  try {
    await supabase.from("contas").insert({
      descricao,
      status,
      tipo_conta,
      logo_image,
      anotacao,
    });
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro em adicionar conta:", error);
  }
}

// Deleta uma conta bancária
export async function deleteAccount(formData: FormData) {
  const excluir = formData.get("excluir");
  const supabase = await createClient();

  try {
    await supabase.from("contas").delete().eq("id", excluir);
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro ao deletar conta:", error);
  }
}

// Atualiza uma conta bancária
export async function updateAccount(formData: FormData) {
  const { id, descricao, status, tipo_conta, logo_image, anotacao } =
    Object.fromEntries(formData.entries());

  const supabase = await createClient();

  try {
    await supabase
      .from("contas")
      .update({
        id,
        descricao,
        status,
        tipo_conta,
        logo_image,
        anotacao,
      })
      .eq("id", id);
    revalidatePath("/conta");
  } catch (error) {
    console.error("Erro ao atualizar conta:", error);
  }
}

// Busca as transações de uma conta bancária específica na tabela transacoes
export async function getAccountInvoice(month, id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      "id, data_compra, periodo, descricao, tipo_transacao, categoria, condicao, forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia, qtde_recorrencia, contas (id, descricao)",
    )
    .eq("periodo", month)
    .or("responsavel.eq.Você,responsavel.eq.Sistema")
    .eq("conta_id", id);

  if (error) {
    console.error("Erro ao buscar transações:", error);
    return null;
  }

  return data;
}

// Busca as receitas de uma conta bancária específica e soma os valores
export async function getSumAccountIncome(month, id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("conta_id", id)
    .eq("periodo", month)
    .eq("tipo_transacao", "Receita")
    .or("responsavel.eq.Você,responsavel.eq.Sistema")
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const sumAccountIncome = data.reduce((sum, item) => {
    const valor = parseFloat(item.valor);
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  return sumAccountIncome;
}

// Busca as despesas de uma conta bancária específica e soma os valores
export async function getSumAccountExpense(month, id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("conta_id", id)
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .or("responsavel.eq.Você, responsavel.eq.Sistema")
    .eq("realizado", true);

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const sumAccountExpense = data.reduce((sum, item) => {
    const valor = parseFloat(item.valor);
    return sum + (isNaN(valor) ? 0 : valor);
  }, 0);

  return sumAccountExpense;
}

// Busca apenas despesas realizadas de uma conta bancária específica e soma os valores
export async function getSumAccountExpensePaid(month) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .eq("realizado", true)
    .eq("responsavel", "Você")
    .neq("responsavel", "Sistema");

  if (error) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  const sumAccountExpensePaid = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return sumAccountExpensePaid;
}

// Busca apenas receitas realizadas de uma conta bancária específica e soma os valores
export async function getSumAccountIncomePaid(month) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("periodo", month)
    .eq("tipo_transacao", "Receita")
    .eq("realizado", true)
    .neq("responsavel", "Sistema");

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const sumAccountIncomePaid = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return sumAccountIncomePaid;
}
