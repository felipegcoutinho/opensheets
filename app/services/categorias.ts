import { createClient } from "@/utils/supabase/server";

export async function getNewCategorias() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, nome, tipo_categoria, usado_para_calculos")
    .order("tipo_categoria", { ascending: false })
    .order("nome", { ascending: true });

  if (error) throw error;

  return data;
}
