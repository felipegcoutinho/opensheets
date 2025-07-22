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

export async function createCard(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: CardFormData = {
    descricao: String(formData.get("descricao")),
    dt_vencimento: String(formData.get("dt_vencimento")),
    dt_fechamento: String(formData.get("dt_fechamento")),
    anotacao: (formData.get("anotacao") as string) || "",
    limite: String(formData.get("limite")),
    bandeira: String(formData.get("bandeira")),
    logo_image: String(formData.get("logo_image")),
    tipo: String(formData.get("tipo")),
    status: String(formData.get("status")),
    conta_id: String(formData.get("conta_id")),
  };

  const validated = cardSchema.omit({ id: true }).safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Corrija os erros do formulário",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const limiteValue = parseMoney(validated.data.limite);

  const { error } = await supabase.from("cartoes").insert({
    ...validated.data,
    limite: limiteValue,
  });

  revalidatePath("/cartao");

  if (error) {
    console.error("Erro ao adicionar cartao:", error);
    return {
      success: false,
      message: "Erro ao adicionar Cartão",
    };
  }

  return {
    success: true,
    message: "Cartão adicionado com sucesso!",
  };
}
