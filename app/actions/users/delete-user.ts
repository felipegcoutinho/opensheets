"use server";

import { createClient } from "@/utils/supabase/server";
import { getClaims } from "@/utils/supabase/claims";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUser(formData: FormData) {
  const supabase = createClient();
  const claims = await getClaims();

  if (claims) {
    // Deleting the profile will trigger the delete_user_from_auth function
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", claims.id);

    if (error) {
      console.error("Error deleting user:", error);
      redirect("/?message=Could not delete user");
    }

    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
