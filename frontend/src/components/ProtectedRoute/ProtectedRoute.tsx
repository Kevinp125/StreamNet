//this component is simple it is just a wrapper that checks if the user is authenticated from the context we have set up
//If user isnt defined it means no one is signed in / authenticated so return them to the landing page
//otherwise return whatever is wrapped in the ProtectedRoute component which would be the page itself

import { useAuthContext } from "@/Context/AuthProvider";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const { user } = useAuthContext();

  if (!user) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}
