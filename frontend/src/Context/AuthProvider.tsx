import type { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "@/lib/supabaseclient";
import { getNotificationSettings } from "@/lib/api_client";

//context type
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  notificationSettings: any | null;
  setNotificationSettings: (settings: any) => void;
  signOut: () => void;
};
//creating the context with default values for the session, user, notif sttings, and udater and signOut method
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  notificationSettings: null,
  setNotificationSettings: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); //true by default cause its loading until info is loaded
  const [notificationSettings, setNotificationSettings] = useState<any | null>(null);

  //on page mount we want to check the users auth status
  useEffect(() => {
    //function to populate all the data that will be stored in the context. session user details etc
    async function setData() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user || null);

      if (session?.access_token) {
        try {
          const settings = await getNotificationSettings(session.access_token);
          setNotificationSettings(settings);
        } catch (error) {
          setNotificationSettings(null);
        }
      }

      setLoading(false); //dont forget to set loading to false afterwards
    }

    //this onAuthStateChange is a supabase provided function that listens to whenever user signs in, signs out, token refreshes, etc. As soon as any of this happens event is fired and all context state is updated accordingly
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.access_token) {
        try {
          const settings = await getNotificationSettings(session.access_token);
          setNotificationSettings(settings);
        } catch (error) {
          setNotificationSettings(null);
        }
      }
      setLoading(false);
    });

    setData(); //call function that sets the user Data

    //this runs on component unmount so when app closes we unsubscribe from supabase AuthStateChange listener to prevent leaks
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  //now that useEffect executed stores all the state values in value which will be passed to provider
  const value = {
    session,
    user,
    loading,
    notificationSettings,
    setNotificationSettings,
    signOut: async () => {
      await supabase.auth.signOut();
    }, //supabase signout function just store in our signOut for better readability. Other components can acess everywhere
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; //return the context as a provider wrapper with the given values
}

//this a hook we are exporting that can be called in any component just makes our code cleaner. useContext returns an object with all the values set in context
export function useAuthContext() {
  return useContext(AuthContext);
}
