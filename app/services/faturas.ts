import { createClient } from "@/utils/supabase/server";

export async function getFaturas(month: string, cartao_id: number) {
  const supabase = createClient();

  const { data: faturas } = await supabase
    .from("faturas")
    .select(`id, status_pagamento, periodo, cartao_id`)
    .eq("periodo", month)
    .eq("cartao_id", cartao_id);

  return faturas;
}

export async function getInvoiceList(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("getinvoicelists", { month });
  if (error) throw error;

  return data;
}
