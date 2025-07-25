"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse, NoteFormData, noteSchema } from "../../(dashboard)/anotacao/modal/form-schema";

export async function updateNote(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: NoteFormData = {
    id: String(formData.get("id")),
    descricao: String(formData.get("descricao")),
    periodo: String(formData.get("periodo")),
    anotacao: String(formData.get("anotacao")),
  };

  const validated = noteSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("anotacoes")
    .update(validated.data)
    .eq("id", validated.data.id);

  revalidatePath("/anotacao");

  if (error) {
    console.error("Erro ao atualizar anotação:", error);
    return { success: false, message: "Erro ao atualizar anotação!" };
  }

  return { success: true, message: "Anotação atualizada com sucesso!" };
}
