"use server";
import { deleteCategory, ActionResponse } from "@/services/categories";

export async function removeCategory(
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  return deleteCategory(prev, formData);
}
