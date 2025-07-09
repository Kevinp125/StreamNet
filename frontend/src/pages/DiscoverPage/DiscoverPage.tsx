import { useEffect, useState } from "react";
import StreamerGrid from "@/components/StreamerGrid/StreamerGrid";
import StreamerCard from "@/components/StreamerCard/StreamerCard";
import { fetchRecommendedStreamers } from "@/lib/api_client";
import { postStreamerConnection } from "@/lib/api_client";
import { updateUserWeigths } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import type { StreamerProfile } from "@/types/AppTypes";

export default function DiscoverPage() {
  const { session } = useAuthContext();

  const [recommendedStreamers, setRecommendedStreamers] = useState<StreamerProfile[]>([]);
  //below is state and functions that will take care of the modal popping up / interactions
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);

  {
    /*This will be passed through the StreamerGrid component and then to each card so when they are clicked this function is called with that cards info */
  }
  function handleStreamerClick(profile: StreamerProfile) {
    setSelectedStreamer(profile);
  }

  {
    /*This is just passed to modal so that when close is clicked it closes */
  }
  function handleCloseModal() {
    setSelectedStreamer(null);
  }

  //this function gets called by streamercard when connect button is clicked. We passed it down so it can pass the streamerToConnectId up
  async function handleStreamerConnect(streamerToConnectId: string) {
    //useAuthContext takes care of this but if I dont include this check ts whines
    if (!session?.access_token) return;
    try {
      const data = await postStreamerConnection(session?.access_token, streamerToConnectId);

      //if success field is true it means we added a connection then filter out the connection we just added from our recommnededStreamers grid
      if (data.success) {

        //if data was added succesfully we now update all our weights so that our algorithm can improve...
        await updateUserWeigths(session.access_token, streamerToConnectId);

        setRecommendedStreamers(prev =>
          prev.filter(streamer => streamer.id !== streamerToConnectId),
        );
      } else {
        console.error("Connection fetch request failed");
      }
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  }

  //Stretch maybe in future add a not interested and connect button inside modal but for now click will just be detailed view
  //and user has to click out to connect or be not interested.

  useEffect(() => {
    async function storeRecommendedStreamers() {
      if (session?.access_token) {
        const recommendedStreamers = await fetchRecommendedStreamers(session.access_token);
        setRecommendedStreamers(recommendedStreamers);
      }
    }

    storeRecommendedStreamers();
  }, [session?.access_token]); //re-run if token changes like refreshes or when they log in

  return (
    <>
      <StreamerGrid
        handleStreamerClick={handleStreamerClick}
        streamers={recommendedStreamers}
        handleStreamerConnect={handleStreamerConnect}
      />

      {/*Below is modal view we only want it to render if a card is clicked and we call the handleStreamerClick and it setSelectedStreamer to be a profile */}
      {selectedStreamer && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <StreamerCard profile={selectedStreamer} onClose={handleCloseModal} isModal={true} />
        </div>
      )}
    </>
  );
}
