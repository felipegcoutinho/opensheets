import { createClient } from "@/utils/supabase/server";

export async function getCategorias() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categorias")
    .select("id, nome, tipo_categoria, usado_para_calculos, icone")
    .order("tipo_categoria", { ascending: true })
    .order("nome", { ascending: true });

  if (error) throw error;

  return data;
}
