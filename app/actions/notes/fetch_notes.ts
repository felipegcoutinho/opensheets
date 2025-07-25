import { createClient } from "@/utils/supabase/server";

export async function getNotes() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("anotacoes")
    .select(`id, descricao, anotacao`)
    .order("descricao", { ascending: true });

  if (error) throw error;

  return data;
}
