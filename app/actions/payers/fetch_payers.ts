import { createClient } from "@/utils/supabase/server";

export async function getPayers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pagadores")
    .select("id, nome, email, foto, status, anotacao, role")
    .neq("role", "sistema");

  if (error) {
    console.error("Erro ao buscar pagadores:", error);
    throw error;
  }

  return data;
}
