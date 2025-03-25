"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Busca a lista de cartões salvos
export async function getCards() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(
      `id, descricao, dt_vencimento, dt_fechamento, anotacao, limite, bandeira, logo_image, tipo, contas (id, descricao)`,
    )
    .order("descricao", { ascending: true });

  if (error) {
    console.error("Erro ao buscar cartões:", error);
    return null;
  }

  return data;
}

// Busca a lista de Lançamentos para tabela de faturas
export async function getCardInvoice(month, cartao_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, periodo, descricao, tipo_transacao, categoria, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, cartoes (id, descricao, logo_image)`,
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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(
      `id, descricao, dt_vencimento, dt_fechamento, anotacao, limite, bandeira, logo_image, tipo, contas (id, descricao)`,
    )
    .eq("id", id);

  if (error) {
    console.error("Erro ao buscar detalhes do cartão:", error);
    return null;
  }

  return data;
}

// Busca a lista de categoria para tabela
export async function getCategoria(month, categoriaId, tipo_transacao) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transacoes")
    .select(
      `id, data_compra, realizado, periodo, descricao, tipo_transacao, categoria, condicao, 
      forma_pagamento, anotacao, responsavel, valor, qtde_parcela, parcela_atual, recorrencia,
      qtde_recorrencia, cartoes (id, descricao), contas (id, descricao)`,
    )
    .order("data_compra", { ascending: false })
    .eq("periodo", month)
    .eq("responsavel", "Você")
    .eq("tipo_transacao", tipo_transacao)
    .eq("categoria", categoriaId);

  if (error) {
    console.error("Erro ao buscar faturas:", error);
    return null;
  }

  return data;
}

// Adiciona um novo cartão
export async function addCards(formData: FormData) {
  const {
    descricao,
    dt_vencimento,
    dt_fechamento,
    anotacao,
    limite,
    bandeira,
    logo_image,
    tipo,
    conta_id,
  } = Object.fromEntries(formData.entries());

  const supabase = await createClient();

  try {
    await supabase.from("cartoes").insert({
      descricao,
      dt_vencimento,
      dt_fechamento,
      anotacao,
      limite,
      bandeira,
      logo_image,
      tipo,
      conta_id,
    });
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao adicionar cartao:", error);
  }
}

// Deleta um cartão
export async function deleteCards(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = await createClient();

  try {
    await supabase.from("cartoes").delete().eq("id", excluir);
    revalidatePath("/cartao");
  } catch (error) {
    console.error("Erro ao deletar cartao:", error);
  }
}

// Atualiza um cartão
export async function updateCards(formData: FormData) {
  const {
    id,
    descricao,
    dt_vencimento,
    dt_fechamento,
    anotacao,
    limite,
    bandeira,
    logo_image,
    tipo,
    conta_id,
  } = Object.fromEntries(formData.entries());

  const supabase = await createClient();

  try {
    await supabase
      .from("cartoes")
      .update({
        id,
        descricao,
        dt_vencimento,
        dt_fechamento,
        anotacao,
        limite,
        bandeira,
        logo_image,
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
  const supabase = await createClient();

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

  const getCardSum = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );

  return getCardSum;
}

// Função para obter o limite em uso
export async function getLimiteEmUso(cartao_id) {
  const supabase = await createClient();

  const { error, data } = await supabase
    .from("transacoes")
    .select(`valor`)
    .eq("cartao_id", cartao_id)
    .eq("tipo_transacao", "Despesa")
    .eq("forma_pagamento", "Cartão de Crédito")
    .eq("realizado", false);

  if (error) {
    console.error("Erro ao buscar limite em uso:", error);
    return 0;
  }

  const limiteEmUso = data.reduce(
    (sum, item) => sum + parseFloat(item.valor),
    0,
  );
  return limiteEmUso;
}

// Função para calcular o limite disponível
export async function getLimitesCartao(cartao_id, limite_total) {
  const limiteEmUso = await getLimiteEmUso(cartao_id);
  const limiteDisponivel = limite_total - limiteEmUso;

  return {
    limiteTotal: limite_total,
    limiteEmUso: limiteEmUso,
    limiteDisponivel: limiteDisponivel,
  };
}
