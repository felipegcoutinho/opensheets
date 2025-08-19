"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUser(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Deleting the profile will trigger the delete_user_from_auth function
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)

    if (error) {
      console.error("Error deleting user:", error);
      redirect("/?message=Could not delete user");
    }

    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
