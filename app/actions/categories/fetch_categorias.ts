import { createClient } from "@/utils/supabase/server";

export async function getCategories() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, nome, tipo_categoria, usado_para_calculos")
    .order("tipo_categoria", { ascending: true })
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar categorias:", error);
    return null;
  }

  return data;
}
