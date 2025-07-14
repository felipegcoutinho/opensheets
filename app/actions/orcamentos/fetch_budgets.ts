import { createClient } from "@/utils/supabase/server";

export async function getBudgets(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orcamentos")
    .select("id, valor_orcado, periodo, categorias ( id, nome )")
    .eq("periodo", month)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar orçamentos:", error);
    return [];
  }

  return data;
}
