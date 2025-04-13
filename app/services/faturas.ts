import { createClient } from "@/utils/supabase/server";

export async function getFaturas(month, cartao_id) {
  const supabase = createClient();

  const { data: faturas } = await supabase
    .from("faturas")
    .select(`id, status_pagamento, periodo, cartao_id`)
    .eq("periodo", month)
    .eq("cartao_id", cartao_id);

  return faturas;
}
