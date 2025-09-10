"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  PayerFormData,
  payerSchema,
} from "../../(dashboard)/pagador/modal/form-schema";

export async function createPayer(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: PayerFormData = {
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

  const validated = payerSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  // Garante padrões: role = 'secundario' e is_hidden = false
  const payload = {
    ...validated.data,
    foto: validated.data.foto ?? null,
    role: "secundario",
    is_hidden: false,
    is_auto_send: Boolean(validated.data.is_auto_send) || false,
  } as any;

  const { error } = await supabase.from("pagadores").insert(payload);

  revalidatePath("/pagador");

  if (error) {
    console.error("Erro ao adicionar pagador:", error);
    return { success: false, message: "Erro ao adicionar Pagador" };
  }

  return { success: true, message: "Pagador adicionado com sucesso!" };
}
