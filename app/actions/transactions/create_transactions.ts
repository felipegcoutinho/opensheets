"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { parseFormData } from "./parseFormData";
import { gerarTransacoes } from "./gerarTransacoes";
import { uploadImagem } from "./uploadImagem";
import {
  ActionResponse,
  TransactionFormData,
  transactionSchema,
} from "../../(dashboard)/lancamentos/modal/form-schema";

export async function createTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: TransactionFormData = {
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
    segundo_responsavel: (formData.get("segundo_responsavel") as string) || "",
    dividir_lancamento: (formData.get("dividir_lancamento") as string) || "",
    realizado: (formData.get("realizado") as string) || "",
  };

  const validated = transactionSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  try {
    const dados = await parseFormData(formData);
    const imagem_url = await uploadImagem(formData.get("imagem_url"), supabase);
    const transacoes = gerarTransacoes(dados, imagem_url);

    if (transacoes.length === 0) {
      return { success: false, message: "Nenhuma transação gerada." };
    }

    const { error } = await supabase.from("transacoes").insert(transacoes);
    revalidatePath("/dashboard");
    revalidatePath("/lancamentos");

    if (error) {
      console.error("Erro ao adicionar transações:", error);
      return { success: false, message: "Erro ao adicionar Lançamento" };
    }

    return { success: true, message: "Lançamento adicionado com sucesso!" };
  } catch (err) {
    console.error("Erro ao adicionar lançamento:", err);
    return { success: false, message: "Erro ao adicionar Lançamento" };
  }
}
