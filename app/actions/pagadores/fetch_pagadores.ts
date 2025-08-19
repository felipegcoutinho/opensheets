import { createClient } from "@/utils/supabase/server";

export async function getPayers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select(
      "id, nome, email, status, anotacao, is_auto_send, foto, is_hidden, role, last_mail",
    )
    .eq("is_hidden", false)
    .order("role", { ascending: true });

  if (error) throw error;

  return data;
}

export async function getActivePayers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select(
      "id, nome, email, status, anotacao, is_auto_send, foto, is_hidden, role, last_mail",
    )
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
    .select("id, nome, email, role, foto, is_hidden, status, is_auto_send, last_mail")
    .eq("is_hidden", false)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}
