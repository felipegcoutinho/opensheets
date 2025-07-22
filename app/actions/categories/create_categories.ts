"use server";
import { addCategory, ActionResponse } from "@/services/categories";

export async function createCategory(
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return addCategory(prev, formData);
}
