"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getCards() {
  "use server";
  const cookiestore = cookies();

  const supabase = createClient();
  const { data: cards } = await supabase
    .from("cartoes")
    .select(`id, descricao, dt_vencimento, cor_padrao, dt_fechamento,  anotacao, limite, bandeira, tipo, contas (id, descricao)`);

  return cards;
}

export async function getTransactionInvoice(month, cartao_id) {
  "use server";
  const cookiestore = cookies();

  const supabase = createClient();
  const { data: transacao, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria, condicao, 
      forma_pagamento, notas, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
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

export async function getCardsDetails(id) {
  "use server";
  const cookiestore = cookies();

  const supabase = createClient();
  const { data: cards } = await supabase
    .from("cartoes")
    .select(`id, descricao, dt_vencimento, dt_fechamento, cor_padrao, anotacao, limite, bandeira, tipo, contas (id, descricao)`)
    .eq("id", id);

  return cards;
}

export async function addCards(formData) {
  "use server";
  const cookieStore = cookies();

  const { descricao, dt_vencimento, dt_fechamento, cor_padrao, anotacao, limite, bandeira, tipo, conta_id } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  await supabase.from("cartoes").insert({ descricao, dt_vencimento, dt_fechamento, cor_padrao, anotacao, limite, bandeira, tipo, conta_id });
  revalidatePath("/cartoes");
}

export async function deleteCards(formData) {
  "use server";
  const cookieStore = cookies();

  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("cartoes").delete().eq("id", excluir);
  revalidatePath("/dashboard");
}

export async function updateCards(formData) {
  "use server";
  const cookieStore = cookies();

  const { id, descricao, dt_vencimento, dt_fechamento, cor_padrao, anotacao, limite, bandeira, tipo, conta_id } = Object.fromEntries(
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
      cor_padrao,
      anotacao,
      limite,
      bandeira,
      tipo,
      conta_id,
    })
    .eq("id", id);
  revalidatePath("/dashboard");
}
