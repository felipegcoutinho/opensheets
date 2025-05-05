import { createClient } from "@/utils/supabase/server";

export async function getNotesStats(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("anotacoes")
    .select("count()")
    .eq("periodo", month);

  if (error) throw error;

  const total = data[0].count;

  return total;
}

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
