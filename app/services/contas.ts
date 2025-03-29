import { createClient } from "@/utils/supabase/server";

export async function getAccountsStats() {
  const supabase = createClient();

  const { data, error } = await supabase.from("contas").select("count()");
  if (error) throw error;
  return data;
}

export async function getAccount() {
  const supabase = await createClient();

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
export async function getAccountDetails(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contas")
    .select(`id, descricao, status, tipo_conta, logo_image, anotacao`)
    .eq("id", id);

  if (error) {
    console.error("Erro ao buscar detalhes das contas:", error);
    return null;
  }

  return data;
}
