import { createClient } from "@/utils/supabase/server";

export async function getUserName() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const firstName = user?.user_metadata?.first_name ?? "";
  const lastName = user?.user_metadata?.last_name ?? "";

  // Se não houver nome, retorna null
  if (!firstName && !lastName) {
    return null;
  }

  const fullName = `${firstName} ${lastName}`.trim();
  return fullName;
}

export async function getEmail() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  // Se houver erro ou não houver dados, retorna null
  if (error || !data?.user) {
    return null;
  }

  const email_data = data.user?.user_metadata?.email;
  return email_data ?? null;
}

export async function getSession() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
