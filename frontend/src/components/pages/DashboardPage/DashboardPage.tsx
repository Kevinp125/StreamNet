import { supabase } from "@/supabaseclient";

const {
  data: { user },
} = await supabase.auth.getUser(); //this gets a user depending on the session that is stored in local storage. This was done when user logged in. If a session exists the user object gets returned

if (user) {
  console.log(user);
} else {
  console.log("no session");
}
export default function DashboardPage() {
  return <p className="text-white">In Dash</p>;
}
