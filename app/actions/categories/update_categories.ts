"use server";
import { updateCategory, ActionResponse } from "@/services/categories";

export async function editCategory(
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return updateCategory(prev, formData);
}
