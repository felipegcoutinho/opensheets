"use server";
import { deleteTransaction, removeImage } from "@/services/lancamentos";
import { ActionResponse } from "@/services/lancamentos";

export async function removeTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return deleteTransaction(formData);
}

export { removeImage };
