"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse, AccountFormData, accountSchema } from "../../(dashboard)/conta/modal/form-schema";

export async function updateAccount(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: AccountFormData = {
    id: String(formData.get("id")),
    descricao: String(formData.get("descricao")),
    tipo_conta: String(formData.get("tipo_conta")),
    logo_image: String(formData.get("logo_image")),
    anotacao: (formData.get("anotacao") as string) || "",
    is_ignored: String(formData.get("is_ignored")),
  };

  const validated = accountSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("contas")
    .update(validated.data)
    .eq("id", validated.data.id);

  revalidatePath("/conta");

  if (error) {
    console.error("Erro ao atualizar conta:", error);
    return { success: false, message: "Erro ao atualizar Conta" };
  }

  return { success: true, message: "Conta atualizada com sucesso!" };
}
