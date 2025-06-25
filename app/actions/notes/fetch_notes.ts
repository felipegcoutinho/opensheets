import { createClient } from "@/utils/supabase/server";

export async function getNotesStats(month: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("anotacoes")
    .select("id", { count: "exact", head: true })
    .eq("periodo", month);

  if (error) throw error;

  return count ?? 0;
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
