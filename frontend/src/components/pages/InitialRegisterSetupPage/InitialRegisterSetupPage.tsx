import { supabase } from "@/supabaseclient";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//this page is like a traffic director. Once we do getch request to check user that will return if user hasCompletedSetup or not. if they havent we want to nav them to setup page where they fill out extra info if not straigh to dash
export default function InitialRegisterSetupPage() {
  {
    /*In here is where fetch requesto backend to setup profile is going to take plac. You will send in Authorization header the token we get from session above  */
  }

  const navigate = useNavigate();

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

          const data = await res.json();
          console.log("User authenticated:", data.user); //I know console logs = no good but just have this here now to show auth flow is working until middle step is setup
        
          // For now: if user exists, go to dashboard
          navigate('/dashboard');

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
