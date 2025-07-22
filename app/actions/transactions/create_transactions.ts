"use server";
import { addTransaction } from "@/services/lancamentos";
import { ActionResponse } from "@/services/lancamentos";

export async function createTransaction(
  _prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return addTransaction(formData);
}
