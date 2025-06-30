import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/Context/AuthProvider";

//this page is like a traffic director. We are going to check if there is a profile in our database already. If there is then user can skip setup step. If there isnt user needs to do the setup.
export default function InitialRegisterSetupPage() {

  const navigate = useNavigate();
  const {session, user} = useAuthContext(); //this will grab the session and user from AuthContext since this is a protected page they will exist guaranteed

  useEffect(() => {
    console.log(user);
    console.log(session);
    
  }, []);

  return <p className="text-white">Extra Setup</p>;
}
