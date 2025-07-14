import { createClient } from "@/utils/supabase/server";

export async function getBudgetById(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orcamentos")
    .select("id, descricao, valor_orcado, periodo, categoria_id")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar orçamento:", error);
    return null;
  }

  return data;
}
