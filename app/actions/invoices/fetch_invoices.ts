import { createClient } from "@/utils/supabase/server";

export async function getFaturas(month: string, cartao_id: string) {
  const supabase = createClient();

  const { data } = await supabase
    .from("faturas")
    .select(`id, status_pagamento, periodo, cartao_id, created_at`)
    .eq("periodo", month)
    .eq("cartao_id", cartao_id);

  return data;
}

export async function getInvoiceList(month: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_faturas", { month });

  if (error) throw error;

  return data;
}
