"use server";
import { updateBudget, ActionResponse } from "@/services/budgets";

export async function editBudget(
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return updateBudget(prev, formData);
}
