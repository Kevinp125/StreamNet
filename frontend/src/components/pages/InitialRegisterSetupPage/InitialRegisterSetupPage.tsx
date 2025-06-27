import { supabase } from "@/supabaseclient";
import { useEffect } from "react";

export default function InitialRegisterSetupPage() {
  {
    /*In here is where fetch requesto backend to setup profile is going to take plac. You will send in Authorization header the token we get from session above  */
  }

  useEffect(() => {
    async function checkUserProfile() {
      try {
        const sessionResult = await supabase.auth.getSession();
        const token = sessionResult.data?.session?.access_token;

        if (!token) {
          console.error("No token grabbed from session");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // TODO: const data = await res.json(); // user info from backend
        // TODO: Check if user has completed setup
        // TODO: If setup complete → navigate('/dashboard')
        // TODO: If setup incomplete → navigate('/setup') or show setup form
      } catch (err) {
        console.error("Auth check failed:", err);
        //TODO: Redirect to login page
      }
    }
    checkUserProfile();
  }, []);

  return <p className="text-white">Extra Setup</p>;
}
