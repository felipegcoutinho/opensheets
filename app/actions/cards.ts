"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCards() {
  const supabase = createClient();

  const { data: cards } = await supabase
    .from("cartoes")
    .select(`id, descricao, dt_vencimento, aparencia, dt_fechamento, anotacao, limite, bandeira, tipo, contas (id, descricao)`)
    .order("descricao", { ascending: true });

  return cards;
}

export async function getCardInvoice(month, cartao_id) {
  const supabase = createClient();

  const { data: transacao, error } = await supabase
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
    console.error("Error fetching transactions:", error);
    return null;
  }

  return transacao;
}

export async function getCardDetail(id) {
  const supabase = createClient();

  const { data: cards } = await supabase
    .from("cartoes")
    .select(`id, descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, contas (id, descricao)`)
    .eq("id", id);

  return cards;
}

export async function addCards(formData: FormData) {
  const { descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, conta_id } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  2;
  await supabase.from("cartoes").insert({ descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, conta_id });
  revalidatePath("/cartoes");
}

export async function deleteCards(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("cartoes").delete().eq("id", excluir);
  revalidatePath("/dashboard");
}

export async function updateCards(formData: FormData) {
  const { id, descricao, dt_vencimento, dt_fechamento, aparencia, anotacao, limite, bandeira, tipo, conta_id } = Object.fromEntries(
    formData.entries()
  );

  const supabase = createClient();
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
  revalidatePath("/dashboard");
}
