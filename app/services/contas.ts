import { createClient } from "@/utils/supabase/server";

export async function getAccount() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contas")
    .select(`id, descricao, status, tipo_conta, logo_image, anotacao`);

  if (error) {
    console.error("Erro ao buscar contas:", error);
    return null;
  }

  return data;
}

// Busca detalhes de uma conta bancária específica
export async function getAccountDetails(id: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contas")
    .select(`id, descricao, status, tipo_conta, logo_image, anotacao`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar detalhes das contas:", error);
    return null;
  }

  return data;
}

export async function getAccountsStats() {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("contas")
    .select("id", { count: "exact", head: true });

  if (error) throw error;

  return count ?? 0;
}
