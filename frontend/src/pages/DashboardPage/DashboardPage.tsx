import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DISCOVER_PATH } from "@/lib/paths";
import StreamerCard from "@/components/StreamerCard/StreamerCard";
import { fetchStreamerInfo } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import { LogOut } from "lucide-react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import NotificationList from "@/components/NotificationList/NotificationList";
import { Settings } from "lucide-react";
import NotificationSettingsModal from "@/components/NotificationSettingsModal/NotifcationSettingsModal";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { session, signOut } = useAuthContext();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  function handleSettingsClose(){
    setShowSettings(false);
  }

  useEffect(() => {
    async function populateStreamerCard() {
      //once there is a session setLoading to true so we can display loading text since we are checking profile
      try {
        if (!session || !session.access_token) {
          //if there isnt a session we set loading to false because we currently arent checking profile
          setLoading(false);
          throw Error("No valid session");
        }
        setLoading(true);

        //fetch the information through fetchStreamerCardInfo function which calls our api and it returns a profile object
        const profile = await fetchStreamerInfo(session?.access_token);
        setUserProfile(profile);
      } catch (err) {
        console.error(`Failed to load profile, ${err}`);
        //once we are done going through whole try catch block it means loading is done so set state back to false so that the card can be rendered
      } finally {
        setLoading(false);
      }
    }

    populateStreamerCard();
  }, [session]);
  //placing session in dependency array because on page mount session might not be loaded yet so have this here so we can run the fetch user profile again if session gets updated

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center gap-2'>
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <div className='text-white font-bold'>Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-row gap-1 p-14'>
      <div className='flex-1'>
        {/*Dont render streamer card until the profile is available */}
        {userProfile && <StreamerCard profile={userProfile} />}
      </div>

      <div className='flex flex-1 flex-col-reverse items-center gap-6'>
        {/*Prompt of day and recent avtiviy components go here */}

        <Button
          className='h-16 w-72 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105'
          variant='destructive'
          onClick={signOut}
        >
          <LogOut />
          Logout
        </Button>
        <Button
          onClick={() => {
            navigate(DISCOVER_PATH);
          }}
          className='bg-electric-indigo h-16 w-72 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105'
        >
          Discover Streamers!
        </Button>

        <Card className='h-full w-2/3'>
          <CardTitle className='relative flex items-center justify-center'>
            Recent Notifications
            <Settings
              onClick={() => setShowSettings(true)}
              className='text-electric-indigo absolute right-8 h-7 w-7 cursor-pointer transition-transform duration-300 hover:rotate-180'
            />
          </CardTitle>

          <CardContent className='flex flex-col gap-6 text-sm'>
            <NotificationList />
          </CardContent>
        </Card>
      </div>

      {showSettings && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <NotificationSettingsModal onClose = {handleSettingsClose}/>
        </div>
      )}
    </div>
  );
}
