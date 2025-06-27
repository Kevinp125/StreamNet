import { Twitch } from "lucide-react";
import { Button } from "../../ui/button";
import { supabase } from "@/supabaseclient";

// User clicks "Continue with Twitch"

// Supabase → Twitch (login screen)

// Twitch → Supabase auth/v1/callback (to exchange the code)

// Supabase → your site (via your redirectTo value)

async function handleTwitchSignIn() {
  const {} = await supabase.auth.signInWithOAuth({
    //signInWithOAuth sends user to twitch. Twitch asks "do you want to allow this app to get your info through our login". If they say yes twitch redirects back to my website with a code
    provider: "twitch",
    options: {
      redirectTo: import.meta.env.VITE_REDIRECT_URL, //this will redirect user to dashboard page after login / signup
    },

  });
}

export default function LandingPage() {
  return (
    <section className="flex h-screen items-center">
      <div className="flex flex-2 flex-col items-center justify-center">
        <img src="/Streamnet.png" alt="" className="h-96 w-[500px]" />{" "}
        {/* width still arbitrary */}
        <h1 className="text-center text-6xl text-white">StreamNet</h1>
        <p className="text-center text-2xl text-white">
          Connecting streamers <br /> one collab at a time
        </p>
      </div>

      <aside className="bg-light-purple flex h-full flex-1 flex-col items-center justify-center gap-20">
        <h2 className="text-2xl text-white">Login / Signup</h2>
        <Button
          onClick={handleTwitchSignIn}
          className="text-twitch-purple hover: h-12 w-sm cursor-pointer"
        >
          <Twitch /> Continue with Twitch
        </Button>
      </aside>
    </section>
  );
}
