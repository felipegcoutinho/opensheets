import { createClient } from "@/utils/supabase/server";

export async function getCardsStats() {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("cartoes")
    .select("id", { count: "exact", head: true })
    .eq("status", "ativo");

  if (error) throw error;

  return count ?? 0;
}

// Busca a lista de cartões salvos
export async function getCards() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(
      `id, descricao, dt_vencimento, dt_fechamento, status, anotacao, limite, bandeira, logo_image, tipo, contas (id, descricao)`,
    )
    .order("descricao", { ascending: true })
    .eq("status", "ativo");

  if (error) {
    console.error("Erro ao buscar cartões:", error);
    return null;
  }

  return data;
}

// Busca a lista de cartões salvos
export async function getCardsDisabled() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(
      `id, descricao, dt_vencimento, dt_fechamento, status, anotacao, limite, bandeira, logo_image, tipo, contas (id, descricao)`,
    )
    .order("descricao", { ascending: true })
    .eq("status", "inativo");

  if (error) {
    console.error("Erro ao buscar cartões:", error);
    return null;
  }

  return data;
}

// Busca os detalhes do cartão para a página de fatura
export async function getCardDetails(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cartoes")
    .select(
      `id, descricao, dt_vencimento, dt_fechamento, status, anotacao, limite, bandeira, logo_image, tipo, contas (id, descricao)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar detalhes do cartão:", error);
    return null;
  }

  return data;
}
