import { createClient } from "@/utils/supabase/server";

export async function getExpenseBill(month) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpenseBillPaid(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("status_pagamento", "Pago");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getBillsStats(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select("count()")
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data;
}

export async function getBillsByResponsavel(month) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select(
      "id, descricao, periodo, dt_vencimento, categoria, status_pagamento, valor, condicao, qtde_recorrencia, anotacao, responsavel, contas ( id, descricao)",
    )
    .eq("periodo", month)
    .eq("responsavel", "Você");
  if (error) throw error;
  return data;
}

export async function getSumBillsExpensePaid(month) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("status_pagamento", "Pago")
    .eq("responsavel", "Você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

// Busca a lista de boletos salvos
export async function getBills(month) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id, descricao, periodo, dt_vencimento, categoria, status_pagamento, valor, condicao,
      qtde_recorrencia, anotacao, responsavel, contas ( id, descricao)`,
    )
    .eq("periodo", month)
    .order("dt_vencimento", { ascending: true });

  if (error) {
    console.error("Erro em buscar boletos:", error);
    return null;
  }

  return data;
}
