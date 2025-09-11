"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  AccountFormData,
  accountSchema,
} from "../../(dashboard)/conta/modal/form-schema";

export async function createAccount(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: AccountFormData = {
    descricao: String(formData.get("descricao")),
    tipo_conta: String(formData.get("tipo_conta")),
    logo_image: String(formData.get("logo_image")),
    status: String(formData.get("status")),
    anotacao: (formData.get("anotacao") as string) || "",
    is_ignored: String(formData.get("is_ignored")),
  };

  const validated = accountSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  const { error } = await supabase.from("contas").insert(validated.data);
  revalidatePath("/conta");

  if (error) {
    console.error("Erro ao adicionar conta:", error);
    return { success: false, message: "Erro ao adicionar Conta" };
  }

  return { success: true, message: "Conta adicionada com sucesso!" };
}
