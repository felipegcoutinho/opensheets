"use server";
import { deleteBudget, ActionResponse } from "@/services/budgets";

export async function removeBudget(
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return deleteBudget(prev, formData);
}
