import { createClient } from "@/utils/supabase/server";

export async function getNotes(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("anotacoes")
    .select(`id, descricao, periodo, anotacao`)
    .eq("periodo", month)
    .order("descricao", { ascending: true });

  if (error) throw error;

  return data;
}
