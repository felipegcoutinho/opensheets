"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  PayerFormData,
  payerSchema,
} from "../../(dashboard)/pagador/modal/form-schema";

export async function updatePayer(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: PayerFormData = {
    id: String(formData.get("id")),
    nome: String(formData.get("nome")),
    email: String(formData.get("email")),
    status: String(formData.get("status")),
    anotacao: String(formData.get("anotacao")),
    is_auto_send: (() => {
      const v = String(formData.get("is_auto_send") ?? "");
      return v === "on" || v === "true";
    })(),
    foto: (() => {
      const raw = formData.get("foto");
      const v = typeof raw === "string" ? raw : "";
      if (!v || v === "__none__") return null;
      return v;
    })(),
  };

  const validated = payerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  // Trava: não permitir que o pagador com role 'principal' fique inativo
  try {
    const { data: current, error: fetchErr } = await supabase
      .from("pagadores")
      .select("role")
      .eq("id", validated.data.id)
      .single();

    if (fetchErr) throw fetchErr;

    if (
      (current?.role || "").toLowerCase() === "principal" &&
      (validated.data.status || "").toLowerCase() === "inativo"
    ) {
      return {
        success: false,
        message: "O pagador principal não pode ser definido como inativo.",
      };
    }
  } catch (e) {
    console.error("Erro ao verificar role do pagador:", e);
    return { success: false, message: "Falha ao validar dados do pagador" };
  }
  const { error } = await supabase
    .from("pagadores")
    .update({
      nome: validated.data.nome,
      email: validated.data.email,
      status: validated.data.status,
      anotacao: validated.data.anotacao,
      is_auto_send: Boolean(validated.data.is_auto_send) || false,
      foto: validated.data.foto ?? null,
    })
    .eq("id", validated.data.id);

  revalidatePath("/pagador");

  if (error) {
    console.error("Erro ao atualizar pagador:", error);
    return { success: false, message: "Erro ao atualizar Pagador" };
  }

  return { success: true, message: "Pagador atualizado com sucesso!" };
}
