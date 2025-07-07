/* eslint-disable @typescript-eslint/no-explicit-any */
//this component is simple it is just a wrapper that checks if the user is authenticated from the context we have set up
//If user isnt defined it means no one is signed in / authenticated so return them to the landing page
//otherwise return whatever is wrapped in the ProtectedRoute component which would be the page itself

import { useAuthContext } from "@/Context/AuthProvider";
import { Navigate } from "react-router-dom";
import { LANDING_PATH } from "@/lib/paths";

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuthContext();

  //in order to give time to AuthProvider to get user and session information make sure we display loading state first. Once this is switched to false we can return the page
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!user) {
    // user is not authenticated
    return <Navigate to={LANDING_PATH} />;
  }
  return <>{children}</>;
}
