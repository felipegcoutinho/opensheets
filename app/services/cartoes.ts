import { createClient } from "@/utils/supabase/server";

export async function getCardsStats() {
  const supabase = createClient();

  const { data, error } = await supabase.from("cartoes").select("count()");
  if (error) throw error;
  return data;
}

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
