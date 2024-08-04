"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Busca a lista de cartões salvos
export async function getCards() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(`id, descricao, dt_vencimento, aparencia, dt_fechamento, anotacao, limite, bandeira, tipo, contas (id, descricao)`)
    .order("descricao", { ascending: true });

  if (error) {
    console.error("Erro ao buscar cartões:", error);
    return null;
  }

  return data;
}

// Busca a lista de transações para tabela de faturas
export async function getCardInvoice(month, cartao_id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia`
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month)
    .eq("cartao_id", cartao_id);

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Busca os detalhes do cartão para a página de fatura
export async function getCardDetails(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(`id, descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, contas (id, descricao)`)
    .eq("id", id);

  if (error) {
    console.error("Erro ao buscar detalhes do cartão:", error);
    return null;
  }

  return data;
}

// Adiciona um novo cartão
export async function addCards(formData: FormData) {
  const { descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, conta_id } = Object.fromEntries(formData.entries());

  const supabase = createClient();

  try {
    await supabase.from("cartoes").insert({ descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, conta_id });
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao adicionar cartao:", error);
  }
}

// Deleta um cartão
export async function deleteCards(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
  }
}

// Atualiza um cartão
export async function updateCards(formData: FormData) {
  const { id, descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, conta_id } = Object.fromEntries(
    formData.entries()
  );

  const supabase = createClient();

  try {
    await supabase
      .from("cartoes")
      .update({
        id,
        descricao,
        dt_vencimento,
        dt_fechamento,
        aparencia,
        anotacao,
        limite,
        bandeira,
        tipo,
        conta_id,
      })
      .eq("id", id);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao atualizar cartao:", error);
  }
}

// Busca o valor total das despesas do cartão
export async function getCardSum(month, cartao_id) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("cartao_id", cartao_id)
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa");

  if (error) {
    console.error("Erro ao buscar transacoes:", error);
    return null;
  }

  const getCardSum = data.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return getCardSum;
}
