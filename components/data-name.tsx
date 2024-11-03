import { createClient } from "@/utils/supabase/server";

async function GetUserName() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const first_name = data.user?.user_metadata.first_name;
  const last_name = data.user?.user_metadata.last_name;

  const displayName = `${first_name} ${last_name}`;

  return displayName;
}

export default GetUserName;
