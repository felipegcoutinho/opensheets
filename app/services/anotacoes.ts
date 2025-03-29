import { createClient } from "@/utils/supabase/server";

export async function getNotesStats(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("anotacoes")
    .select("count()")
    .eq("periodo", month);
  if (error) throw error;
  return data;
}

export async function getNotes(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("anotacoes")
    .select(`id, descricao, periodo, anotacao`)
    .eq("periodo", month)
    .order("descricao", { ascending: true });
  if (error) throw error;
  return data;
}
