"use server";
import { addBudget, ActionResponse } from "@/services/budgets";

export async function createBudget(
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return addBudget(prev, formData);
}
