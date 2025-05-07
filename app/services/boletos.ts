import { createClient } from "@/utils/supabase/server";

export async function getExpenseBill(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("responsavel", "você");

  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getExpenseBillPaid(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("status_pagamento", "pago");
  if (error) throw error;

  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

export async function getBillsStats(month: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select("count()")
    .eq("periodo", month)
    .eq("responsavel", "você");

  if (error) throw error;

  const total = data[0].count;

  return total;
}

export async function getBillsByResponsavel(month: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("boletos")
    .select(
      "id, descricao, periodo, dt_vencimento, status_pagamento, valor, condicao, qtde_recorrencia, anotacao, responsavel, contas ( id, descricao), categorias ( id, nome )",
    )
    .eq("periodo", month)
    .eq("responsavel", "você");
  if (error) throw error;
  return data;
}

export async function getSumBillsExpensePaid(month: string) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("boletos")
    .select("valor")
    .eq("periodo", month)
    .eq("status_pagamento", "pago")
    .eq("responsavel", "você");
  if (error) throw error;
  return data.reduce((sum, item) => sum + parseFloat(item.valor), 0);
}

// Busca a lista de boletos salvos
export async function getBills(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id, descricao, periodo, dt_vencimento, status_pagamento, valor, condicao,
      qtde_recorrencia, anotacao, responsavel, contas ( id, descricao), categorias ( id, nome )`,
    )
    .eq("periodo", month)
    .order("dt_vencimento", { ascending: true });

  if (error) {
    console.error("Erro em buscar boletos:", error);
    return null;
  }

  return data;
}

export async function getResponsavelBillList(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select("responsavel, descricao, valor")
    .order("responsavel", { ascending: true })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar boletos:", error);
    return null;
  }

  return data;
}

export async function getBillsByCategory(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select(`valor, categoria:categoria_id ( nome )`)
    .eq("periodo", month)
    .eq("responsavel", "você");
  // .eq("status_pagamento", "Pago");

  if (error) throw error;

  return data;
}

export async function getCategoriaBoletos(month: string, categoriaId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("boletos")
    .select(
      `id, dt_vencimento, periodo, descricao, status_pagamento, anotacao, responsavel, valor, categoria_id!inner(id, nome)`,
    )
    .order("dt_vencimento", { ascending: false })
    .eq("periodo", month)
    .eq("responsavel", "você")
    .eq("categoria_id.nome", categoriaId);

  if (error) {
    console.error("Erro ao buscar boletos:", error);
    return null;
  }

  return data;
}
