"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

export const signUp = async (formData) => {
  "use server";

  const origin = (await headers()).get("origin");
  const email = formData.get("email");
  const firstName = formData.get("first_name");
  const lastName = formData.get("last_name");
  const password = formData.get("password");
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login/signup?message=Could not authenticate user");
  }

  return redirect(
    "/login/signup?message=Check email to continue sign in process",
  );
};
