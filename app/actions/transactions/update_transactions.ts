"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  TransactionFormData,
  transactionSchema,
} from "../../(dashboard)/lancamentos/modal/form-schema";
import { uploadImagem } from "./uploadImagem";

export async function updateTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: TransactionFormData = {
    id: String(formData.get("id")),
    descricao: String(formData.get("descricao")),
    valor: String(formData.get("valor")),
    periodo: String(formData.get("periodo")),
    data_compra: (formData.get("data_compra") as string) || "",
    data_vencimento: (formData.get("data_vencimento") as string) || "",
    tipo_transacao: String(formData.get("tipo_transacao")),
    categoria_id: String(formData.get("categoria_id")),
    forma_pagamento: String(formData.get("forma_pagamento")),
    responsavel: String(formData.get("responsavel")),
    condicao: String(formData.get("condicao")),
    qtde_parcela: (formData.get("qtde_parcela") as string) || "",
    qtde_recorrencia: (formData.get("qtde_recorrencia") as string) || "",
    conta_id: (formData.get("conta_id") as string) || "",
    cartao_id: (formData.get("cartao_id") as string) || "",
    anotacao: (formData.get("anotacao") as string) || "",
    dividir_lancamento: (formData.get("dividir_lancamento") as string) || "",
    realizado: (formData.get("realizado") as string) || "",
  };

  const validated = transactionSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  let imageUrl = String(formData.get("imagem_url_atual") || "");
  const newImage = formData.get("imagem_url");
  if (newImage && newImage instanceof File && newImage.size > 0) {
    const uploaded = await uploadImagem(newImage, supabase);
    if (uploaded) imageUrl = uploaded;
  }

  try {
    const { error } = await supabase
      .from("transacoes")
      .update({
        data_compra: validated.data.data_compra || null,
        data_vencimento: validated.data.data_vencimento || null,
        descricao: validated.data.descricao,
        tipo_transacao: validated.data.tipo_transacao,
        periodo: validated.data.periodo,
        imagem_url: imageUrl || null,
        realizado: validated.data.realizado === "true",
        condicao: validated.data.condicao,
        forma_pagamento: validated.data.forma_pagamento,
        anotacao: validated.data.anotacao,
        responsavel: validated.data.responsavel,
        valor: parseFloat(
          validated.data.valor
            .replace(/R\$\s?/, "")
            .replace(/\./g, "")
            .replace(/,/, "."),
        ),
        qtde_parcela: validated.data.qtde_parcela || null,
        parcela_atual: formData.get("parcela_atual") || null,
        qtde_recorrencia: validated.data.qtde_recorrencia || null,
        cartao_id: validated.data.cartao_id || null,
        categoria_id: validated.data.categoria_id,
        conta_id: validated.data.conta_id || null,
        dividir_lancamento: validated.data.dividir_lancamento === "on",
      })
      .eq("id", validated.data.id);

    revalidatePath("/lancamentos");
    revalidatePath("/dashboard");

    if (error) {
      console.error("Erro ao atualizar transação:", error);
      return { success: false, message: "Erro ao atualizar Lançamento" };
    }

    return { success: true, message: "Lançamento atualizado com sucesso!" };
  } catch (err) {
    console.error("Erro ao atualizar transação:", err);
    return { success: false, message: "Erro ao atualizar Lançamento" };
  }
}

export async function togglePagamento(id: number, realizadoAtual: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transacoes")
    .update({ realizado: !realizadoAtual })
    .eq("id", id);
  if (error) {
    console.error("Erro ao atualizar status de pagamento:", error);
    return { error };
  }
  return { data };
}

export async function payBills(id: number, realizadoAtual: boolean) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("transacoes")
    .update({ realizado: !realizadoAtual })
    .eq("id", id);
  if (error) {
    console.error("Erro ao pagar boletos:", error);
    return null;
  }
  return data;
}
