"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse, NoteFormData, noteSchema } from "../../(dashboard)/anotacao/modal/form-schema";

export async function createNote(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: NoteFormData = {
    descricao: String(formData.get("descricao")),
    periodo: String(formData.get("periodo")),
    anotacao: String(formData.get("anotacao")),
  };

  const validated = noteSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("anotacoes").insert(validated.data);
  revalidatePath("/anotacao");

  if (error) {
    console.error("Erro ao adicionar anotação:", error);
    return { success: false, message: "Erro ao adicionar anotação!" };
  }

  return { success: true, message: "Anotação criada com sucesso!" };
}
