"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

function GetUserName() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      const firstName = data?.user?.user_metadata?.first_name;
      const lastName = data?.user?.user_metadata?.last_name;
      setDisplayName(`${firstName} ${lastName}`);
    };

    fetchUser();
  }, [supabase]);

  if (!displayName) {
    return <span>Carregando...</span>;
  }

  return <span>{displayName}</span>;
}

export default GetUserName;
