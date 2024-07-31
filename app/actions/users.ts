"use server";

import { createClient } from "@/utils/supabase/server";

export async function getResponsavelTransactionList(month) {
  "use server";
  const supabase = createClient();

  const { data: users, error } = await supabase
    .from("transacoes")
    .select("responsavel, cartoes (descricao), valor")
    .order("responsavel", { ascending: true })
    .eq("periodo", month)
    .eq("tipo_transacao", "Despesa");

  if (error) {
    console.error("Erro ao buscar transações:", error);
    return null;
  }

  return users;
}

export async function getResponsavelBillList(month) {
  "use server";
  const supabase = createClient();

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

// export async function getUsers() {
//   "use server";
//   const cookiestore = cookies();

//   const supabase = createClient(cookiestore);
//   const { data: users } = await supabase.from("responsaveis").select(`id, descricao, anotacao`);
//   return users;
// }

// export async function addUsers(formData: FormData) {
//   "use server";
//   const cookieStore = cookies();

//   const { descricao, anotacao } = Object.fromEntries(formData.entries());

//   const supabase = createClient(cookieStore);
//   await supabase.from("responsaveis").insert({ descricao, anotacao });

//   revalidatePath("/responsaveis");
// }

// export async function deleteUsers(formData: FormData) {
//   "use server";
//   const cookieStore = cookies();

//   const excluir = formData.get("excluir") as string;

//   const supabase = createClient(cookieStore);
//   await supabase.from("responsaveis").delete().eq("id", excluir);

//   revalidatePath("/responsaveis");
// }

// export async function updateUsers(formData: FormData) {
//   "use server";
//   const cookieStore = cookies();

//   const { id, descricao, anotacao } = Object.fromEntries(formData.entries());

//   const supabase = createClient(cookieStore);
//   await supabase.from("responsaveis").update({ id, descricao, anotacao }).eq("id", id);

//   revalidatePath("/responsaveis");
// }
