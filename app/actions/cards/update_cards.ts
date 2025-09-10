"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  ActionResponse,
  CardFormData,
  cardSchema,
} from "../../(dashboard)/cartao/modal/form-schema";

function parseMoney(value: FormDataEntryValue | null) {
  if (!value) return 0;
  const str = String(value)
    .replace(/R\$\s?/, "")
    .replace(/\./g, "")
    .replace(/,/, ".");
  return parseFloat(str) || 0;
}

export async function updateCard(
  _prev: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: CardFormData = {
    id: String(formData.get("id")),
    descricao: String(formData.get("descricao")),
    dt_vencimento: String(formData.get("dt_vencimento")),
    dt_fechamento: String(formData.get("dt_fechamento")),
    anotacao: (formData.get("anotacao") as string) || "",
    limite: String(formData.get("limite")),
    bandeira: String(formData.get("bandeira")),
    logo_image: String(formData.get("logo_image")),
    status: String(formData.get("status")),
    conta_id: String(formData.get("conta_id")),
  };

  const validated = cardSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const limiteValue = parseMoney(validated.data.limite);

  const { error } = await supabase
    .from("cartoes")
    .update({
      ...validated.data,
      limite: limiteValue,
    })
    .eq("id", validated.data.id);

  revalidatePath("/cartao");

  if (error) {
    console.error("Erro ao atualizar cartao:", error);
    return {
      success: false,
      message: "Erro ao atualizar Cartão",
    };
  }

  return {
    success: true,
    message: "Cartão atualizado com sucesso!",
  };
}
