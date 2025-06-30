import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/Context/AuthProvider";

//this page is like a traffic director. We are going to check if there is a profile in our database already. If there is then user can skip setup step. If there isnt user needs to do the setup.
export default function InitialRegisterSetupPage() {
  const navigate = useNavigate();
  const { session, user } = useAuthContext(); //this will grab the session and user from AuthContext since this is a protected page they will exist guaranteed
  const [CheckingIfNewUser, setCheckingIfNewUser] = useState(true); //this by default is going to be true because we need to check if the user who just logged in is a new user or returning user

  useEffect(() => {
    async function checkUserProfile() {
      //function will check if the user who jsut logged in has a profile setup in our database
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/check-user-exists`, //this api will just return whether or not user has a profile row (NOT THE SAME AS AUTH ROW)
          {
            headers: {
              Authorization: `Bearer ${session!.access_token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.profileExists) {
          //profile exists will be a custom field sent back by the api. Api will check if there is a profile row for the authenticated user if there is then go striaght to dash
          navigate("/dashboard");
        } else {
          //else means no profile exists yet so we have to show user the extra form to submit extra details
          setCheckingIfNewUser(false); //we dot this by setting this to false because we have concluded our search once this is false loading state wont be returned and form will
        }
      } catch (err) {
        console.error("Failed to check is a user exits in profile already", err);
      }
    }

    checkUserProfile(); //call this function as soon as page loads
  }, []);

  return <p className="text-white">Extra Setup</p>;
}
