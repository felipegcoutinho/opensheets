import { createClient } from "@/utils/supabase/server";

export async function getUserName() {
  const supabase = createClient();

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
    return user?.user_metadata?.name;
  }

  const fullName = `${firstName} ${lastName}`.trim();
  return fullName;
}

export async function getFirstName() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.user_metadata?.first_name ?? null;
}

export async function getLastName() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user.user_metadata?.last_name ?? null;
}

export async function getEmail() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  // Se houver erro ou não houver dados, retorna null
  if (error || !data?.user) {
    return null;
  }

  return data.user.email ?? null;
}

export async function getUserSession() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
