import { createClient } from "@/utils/supabase/server";

export async function getBudgets() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orcamentos")
    .select("id, descricao, valor_orcado, periodo, categorias ( id, nome )")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return [];
  }

  return data;
}
