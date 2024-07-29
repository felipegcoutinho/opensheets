"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAccount() {
  const supabase = createClient();
  const { data: accounts } = await supabase.from("contas").select(`id, descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao`);
  return accounts;
}

export async function addAccount(formData: FormData) {
  const { descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  await supabase.from("contas").insert({ descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao });
  revalidatePath("/contas");
}

export async function deleteAccount(formData: FormData) {
  const excluir = formData.get("excluir");

  const supabase = createClient();
  await supabase.from("contas").delete().eq("id", excluir);
  revalidatePath("/contas");
}

export async function updateAccount(formData: FormData) {
  const { id, descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao } = Object.fromEntries(formData.entries());

  const supabase = createClient();
  await supabase.from("contas").update({ id, descricao, status, saldo_inicial, cor_padrao, tipo_conta, anotacao }).eq("id", id);
  revalidatePath("/contas");
}

export async function getAccountDetail(month: string, id) {
  const supabase = createClient();
  const { data: transacoes } = await supabase.from("transacoes").select("*").eq("periodo", month).eq("conta_id", id).eq("efetivado", "TRUE");
  return transacoes;
}

export async function getAccountSum() {
  const supabase = createClient();
  const { data: accountsSum } = await supabase.from("contas").select(`saldo_inicial.sum()`).eq("status", "ativo");

  return accountsSum;
}
