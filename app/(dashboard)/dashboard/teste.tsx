import { createClient } from "@/utils/supabase/server";

export async function Teste(month) {
  const supabase = await createClient();

  const { data: aaa, error } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Receita")
    .eq("periodo", month)
    .neq("categoria", "Saldo Anterior")
    .eq("responsavel", "Você");

  if (error) {
    console.error("Erro ao buscar receitas:", error);
    return null;
  }

  const { data: bbb, errors } = await supabase
    .from("transacoes")
    .select("valor")
    .eq("tipo_transacao", "Despesa")
    .eq("periodo", month)
    .eq("responsavel", "Você");

  if (errors) {
    console.error("Erro ao buscar despesas:", error);
    return null;
  }

  return { aaa, bbb };
}
