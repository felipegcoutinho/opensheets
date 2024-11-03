"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// export async function signOutt(data) {
//   (await cookies()).delete("name");
//   return redirect("/login");
// }

export async function signOut(data) {
  const supabase = createClient();

  await supabase.auth.signOut();
  return redirect("/login");
}

export const signIn = async (formData) => {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/dashboard");
};
