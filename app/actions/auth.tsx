"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutt(data) {
  (await cookies()).delete("name");
  return redirect("/login");
}

export async function signOut(data) {
  const supabase = createClient();

  await supabase.auth.signOut();
  return redirect("/login");
}
