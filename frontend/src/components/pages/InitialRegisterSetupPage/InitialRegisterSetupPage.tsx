import { supabase } from "@/supabaseclient";
import { useEffect } from "react";

const sessionResult = await supabase.auth.getSession();
const token = sessionResult.data?.session?.access_token;

export default function InitialRegisterSetupPage() {
  {
    /*In here is where fetch requesto backend to setup profile is going to take plac. You will send in Authorization header the token we get from session above  */
  }

  useEffect(() => {
    async function checkUserProfile() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch {}
    }
    checkUserProfile();
  }, []);

  return <p className="text-white">Extra Setup</p>;
}
