"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getAccount() {
  "use server";
  const cookiestore = cookies();

  const supabase = createClient(cookiestore);
  const { data: accounts } = await supabase.from("contas").select(`id, descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao`);
  return accounts;
}

export async function addAccount(formData) {
  "use server";
  const cookieStore = cookies();

  const { descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao } = Object.fromEntries(formData.entries());

  const supabase = createClient(cookieStore);
  await supabase.from("contas").insert({ descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao });
  revalidatePath("/contas");
}

export async function deleteAccount(formData) {
  "use server";
  const cookieStore = cookies();

  const excluir = formData.get("excluir");

  const supabase = createClient(cookieStore);
  await supabase.from("contas").delete().eq("id", excluir);
  revalidatePath("/contas");
}

export async function updateAccount(formData) {
  "use server";
  const cookieStore = cookies();

  const { id, descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao } = Object.fromEntries(formData.entries());

  const supabase = createClient(cookieStore);
  await supabase.from("contas").update({ id, descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao }).eq("id", id);
  revalidatePath("/contas");
}

export async function getAccountDetail(month, id) {
  "use server";
  const cookiestore = cookies();

  const supabase = createClient(cookiestore);
  const { data: transacoes } = await supabase.from("transacoes").select("*").eq("periodo", month).eq("conta_id", id).eq("efetivado", "TRUE");
  return transacoes;
}

export async function getAccountSum() {
  "use server";
  const cookiestore = cookies();

  const supabase = createClient(cookiestore);
  const { data: accountsSum } = await supabase.from("contas").select(`saldo_inicial.sum()`).eq("status", "ativo");

  return accountsSum;
}
