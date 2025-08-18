import { createClient } from "@/utils/supabase/server";

export async function getPayers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select("id, nome, email, status, anotacao, foto, is_hidden, role")
    .eq("is_hidden", false)
    .order("role", { ascending: true });

  if (error) throw error;

  return data;
}

export async function getActivePayers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select("id, nome, email, status, anotacao, foto, is_hidden, role")
    .eq("status", "ativo")
    .eq("is_hidden", false)
    .neq("role", "sistema");

  if (error) throw error;

  return data;
}

export async function getPayersName(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select("id, nome, email, role, foto, is_hidden, status")
    .eq("is_hidden", false)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}
