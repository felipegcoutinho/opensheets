import { createClient } from "@/utils/supabase/server";

export async function getPagadores() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select("id, nome, email, status, anotacao, foto, role")
    .order("nome", { ascending: true });

  if (error) throw error;

  return data;
}
