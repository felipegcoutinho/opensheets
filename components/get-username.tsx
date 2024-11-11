import { createClient } from "@/utils/supabase/server";

async function GetUserName() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  const firstName = data?.user?.user_metadata?.first_name;
  const lastName = data?.user?.user_metadata?.last_name;
  const displayName = `${firstName} ${lastName}`;

  return displayName;
}

export default GetUserName;
