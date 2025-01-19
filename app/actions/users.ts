"use server";

import { createClient } from "@/utils/supabase/server";

export async function getResponsavelTransactionList(month) {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("transacoes")
    .select("responsavel, cartoes (descricao, logo_image), valor")
    .order("responsavel", { ascending: true })
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa")
    .neq("responsavel", "Sistema");

  if (error) {
    console.error("Erro ao buscar transações:", error);
    return null;
  }

  return users;
}

export async function getResponsavelBillList(month) {
  const supabase = await createClient();

  const { data: bills, error } = await supabase
    .from("boletos")
    .select("responsavel, descricao, valor")
    .order("responsavel", { ascending: true })
    .eq("periodo", month);

  if (error) {
    console.error("Erro ao buscar boletos:", error);
    return null;
  }

  return bills;
}

export async function getUserName() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const firstName = user?.user_metadata?.first_name ?? "";
  const lastName = user?.user_metadata?.last_name ?? "";

  // Se não houver nome, retorna null
  if (!firstName && !lastName) {
    return null;
  }

  const fullName = `${firstName} ${lastName}`.trim();
  return fullName;
}

export async function getEmail() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  // Se houver erro ou não houver dados, retorna null
  if (error || !data?.user) {
    return null;
  }

  const email_data = data.user?.user_metadata?.email;
  return email_data ?? null;
}
